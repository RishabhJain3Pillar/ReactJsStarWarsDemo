import React, { Component } from 'react';
import List from './List.js'
import loader from './../loader.gif';
import Modal from '../Modal.js'
import PlanetsDetails from './PlanetsDetails.js'
import {debounce} from 'throttle-debounce';


class HomePage extends Component {

  state = {
    planets: [],
    items: [],
    displayModal : false,
    displayInfoModal : false,
    errorMessage : "",
    isLoading : false,
    selectedPlanet : {},
    nextPage : null,
    searchText: "",
    searchAttempts: 0,
    timeElapsed: 0
  }

render() {
  const user = JSON.parse(localStorage.getItem('user'))
  return (
    <div>
    <Modal show = {this.state.displayModal} children = {this.state.errorMessage} handleClose = {() => this.setState({displayModal : false})} ></Modal>
    <div className={this.state.isLoading ? "modal display-block" : "modal display-none"}>
        <img src={loader} className="loader" alt="loader" />
    </div>
        <h3 style={{color:'#ffcc00', margin:'10px', width:'100%', height:'auto'}}>
          <button style={{width:'auto', position:'absolute', right:'0'}} className="button-normal" onClick={this.onLogout} >Logout</button>
        </h3>
     <div style={{margin:'40px 10px'}}>
          <form>
              <input style={{padding:'5px', height:'5vmin', width:'960px', marginLeft:'40px'}} type="text" className="input-search" placeholder="Search planets" onChange={(event) =>this.filterList(event.target.value)}/>
          </form>
          <List  items={this.state.items} onItemClick={this.onListItemClicked}/>

          <PlanetsDetails  show= {this.state.displayInfoModal} position = {this.state.planets.indexOf(this.state.selectedPlanet)} children = {this.state.selectedPlanet} handleClose = {() => this.setState({displayInfoModal : false})} ></PlanetsDetails>
          <div class="App">
          <button style={{ marginLeft:'40px'}} disabled={!this.state.nextPage} className="button-loadmore" onClick={this.loadNextPage} >Load More</button>
          </div>
        </div>
    </div>
  );
  }
  
  //Life-Cycle Methods starts---------------------------
  componentDidMount() {
    this.setState({isLoading : true})
    fetch("https://swapi.co/api/planets/?search=" + this.state.searchText)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json()
      })
      .then(data => {
        this.populateList(data.results)
        this.setState({
          nextPage: data.next
        })
      })
      .then(() => this.setState({isLoading : false}))
      .catch(error => {
        this.setState({
          errorMessage: "Something went wrong. Please try again.",
          displayModal: true,
          isLoading: false
        })
      })
  }

  componentWillUnnount() {
    clearTimeout(this.timeoutId)
    clearInterval(this.intervalId)
  }
  //Life-Cycle Methods ends------------------------------

  //Handles planet list item click events(setting states)
  onListItemClicked = (selectedPlanet) => {
    this.setState({
      selectedPlanet: selectedPlanet,
      displayInfoModal: true,
    })
  }

  //Populate all the planet items in the list setting states
  populateList = (planets) => {
    this.setState({
      planets: planets,
      items : planets
    })
  }

  //On seraching implement filter to find item from the list
  filterList = (value) => {
    this.setState({
      searchText: value
    });
    this.onSearchQuery()
  }

  // this method helps to handle searching attemps and queries
  // if user is Luke(No Limit on search) else other user will have 5 attemps
  onSearchQuery = debounce(1000, () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if ('Luke Skywalker' === user.name || this.state.searchText === '') {
      this.componentDidMount()
      return
    }
    var searchAttempts = this.state.searchAttempts
    searchAttempts++

    if (searchAttempts > 5) {
      this.setState({
        errorMessage: `5 Search attempts per minute reached.`,
        displayModal: true
      })
      return
    }

    if (searchAttempts === 1) {
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(this.resetTimer, 60000)
      clearInterval(this.intervalId)
      this.intervalId = setInterval(this.calculateSeconds, 1000)
    }
    this.setState({
      searchAttempts : searchAttempts
    })

    this.componentDidMount()
  });

  loadNextPage = () => {
    console.log(this.state.nextPage);
    if (!this.state.nextPage) {
      return
    }
    this.setState({isLoading : true})
    fetch(this.state.nextPage)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json()
      })
      .then(data => {
        this.setState({
          planets: this.state.planets.concat(data.results),
          nextPage: data.next
        })
      this.populateList(this.state.planets)
      })
      .then(() => this.setState({isLoading : false}))
      .catch(error => {
        this.setState({
          errorMessage: "Something went wrong. Please try again.",
          displayModal: true,
          isLoading: false
        })
      })
  }
  
  resetTimer = () => {
    this.setState({
      searchAttempts : 0,
      timeElapsed: 0,
      displayModal: false
    })
    clearInterval(this.intervalId)
  }

  calculateSeconds = () => {
    this.setState({
      errorMessage: `5 Search attempts per minute reached. Retry in ${59 - this.state.timeElapsed} seconds`,
      timeElapsed: this.state.timeElapsed + 1
    })
  }

  onLogout = () => {
    localStorage.removeItem('user');
    clearTimeout(this.timeoutId)
    clearInterval(this.intervalId)
    this.props.history.push("/login")
  }

}

export default HomePage;
