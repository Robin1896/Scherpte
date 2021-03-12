import React from 'react';
import '../styles/main.scss';
// import fire from './fire';
const cv = require('./opencv.js')

class Sharpness extends React.Component {

  constructor(props) {
  super(props);
  this.imageRef = React.createRef()
  this.canvasRef = React.createRef()
    this.state = {
      object : [],
      base64: [],
      width: [],
      height: [],
      imageRef: [],
      sharpness: [],
    };
  }

  convertBase64 = (file) => {
    return new Promise((resolve, reject) =>{
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
        fileReader.onload = (()=> {
          resolve(fileReader.result);
        });
        fileReader.onerror = ((error) => {
          reject(error);
        });
    });
  };

  uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await this.convertBase64(file);
    this.setState({base64: base64, imageProps: file, imageRef: this.imageRef.current});
    let imgElement = this.state.imageRef
    imgElement.src = URL.createObjectURL(this.state.imageProps)
    imgElement.onload = () => {

      let dst = new cv.Mat();
      let men = new cv.Mat();
      let menO = new cv.Mat();

      let src = cv.imread(imgElement);
      var t = cv.Laplacian(src, dst, cv.CV_64F, 1, 1, 0, cv.BORDER_DEFAULT);
      console.log(t,cv.meanStdDev(dst, menO, men),menO.data64F[0], men.data64F[0]);

      this.setState({sharpness: men.data64F[0]});
    }
  }

render() {
  return (
    <div className="sharpness">
      <div className="sharpness__image">
        <img ref={this.imageRef} src={this.state.base64} alt="afbeelding" />
        <div>Scherpte:{this.state.sharpness}</div>
      </div>
      <br />
      <input className="filetest" type="file" onChange={(e)=> {this.uploadImage(e);}} />
    </div>
  )};
};

export default Sharpness;