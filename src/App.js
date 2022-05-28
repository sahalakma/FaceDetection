import React, { Component } from 'react'
import Clarifai from 'clarifai'
import Navigation from './Components/Navigation/Navigation'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition'
import Logo from './Components/Logo/Logo'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkFrom'
import Particle from './Components/Particles/Particles'
import './App.css';


const app = new Clarifai.App({
 apiKey: 'a7ee076a814f465f8e06b450da5b7ebc'
});

const initialState = {
  
    input : '',
    imageUrl : '',
    box : {}
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState ;
  }

  calculateFaceLocation = (data) =>{
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image = document.getElementById("inputimage");
   const width = parseInt(image.width);
   const height = parseInt(image.height);
   return {
    leftCol : clarifaiFace.left_col * width,
    topRow : clarifaiFace.top_row * height,
    rightCol : width - (clarifaiFace.right_col * width),
    bottomRow : height - (clarifaiFace.bottom_row * height)
   }
  }


  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box : box});
  }

  onInputChange = (event) =>{
    this.setState({input: event.target.value})
  }
  
  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
    .then(response =>this.displayFaceBox(this.calculateFaceLocation(response)))
      // console.log(response.outputs[0].data.regions[0].region_info.bounding_box))
    .catch(err => console.log(err));
  }
  

  render(){
   const { imageUrl, box } = this.state ;
  return (
    <div className="App">
      <Particle />
      <Navigation />
      <Logo />
      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
      <FaceRecognition box={box} imageUrl={imageUrl} />
    </div>
  );
  }
}

export default App;
