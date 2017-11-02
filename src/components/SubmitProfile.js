import React from 'react';
import api from '../constructor/Api'
import { TweenMax, TimelineLite, Elastic } from 'gsap';

import UnaFilter from '../filters/UnaFilter';
import sprite from '../images/sprite.svg';

import Topbar from './Topbar';

export default class submitProfile extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      author_social: "",
      author_email: "",
      photo: null
    }
  }

  componentWillMount() {
    this.setState({
      loading: false
    });
    this.animateForm();
  }

  changeImage = (e) => {
    const reader = new FileReader();
    // Access the files associated to the input: Tell the reader to go read the file
    reader.readAsDataURL(e.target.files[0]);

    reader.addEventListener('load', () => {
      this.setState({
        photo: reader.result
      })
    });
  }

  submitProfile = (e) =>{
    e.preventDefault();

    // getRef={(input) => this.description = input}

    this.updateImage().then((url) => {
      api.post(`posts`, {
        data: {
          post: {
            name: this.name.value,
            description: this.description.value,
            position: this.position.value,
            category: 'sharevision',
            photo: url,
            author_social: "",
            author_email: ""
          }
        }
      }).then(() => {
        this.props.history.push('/grid');
      });
    });
  }

  updateImage = () => {
    // const promise = new Promise((resolve, reject) => {
    //   if (!this.state.photo) {
    //     return resolve(this.state.user.photo);
    //   }
    //   // create a reference to firebase storage
    //   const storageRef = base.storage().ref();
    //   // create a reference to the img that will be uploaded
    //   const imgRef = storageRef.child(`${id}.jpg`);
    //   // get a ref to the input for the image and access the actual file that the person is trying to upload(files[0])
    //   imgRef.put(this.photo.files[0]).then((snapshot) => {
    //     // to be able to show the image, you need to get its url by calling getDownloadURL (imgUrl refers to the img url in firebase)
    //     imgRef.getDownloadURL().then((imgUrl) => {
    //       resolve(imgUrl);
    //     });
    //   });
    // });
    // return promise;
  }

  animateForm = () => {
    TweenMax.from('.submit__image', 1, {x: '-200%', delay: 0.3, ease: Elastic.easeOut.config(0.2, 0.3)});
    TweenMax.from('.submit__inner', 1, {x: '200%', delay: 0.3, ease: Elastic.easeOut.config(0.2, 0.3)})
  }

  render() {
    if (this.state.loading) {
      return(
        <div>
          <p className="loading">Загрузка...</p>
        </div>
      )
    }

    return (
      <div className="submit">
        <Topbar />
        <div className="submit__wrapper">
          <div className="submit__image">
            <label className={`submit__image-preview ${this.state.photo ? 'is-chosen' : ''} `} htmlFor="change-img">
              <img src={this.state.photo} />
              <div className="submit__image-placeholder">
                <svg className="ico ico-upload">
                  <use xlinkHref={sprite + "#ico-upload"} />
                </svg>
                <span>Загрузить изображение</span>
              </div>
            </label>
            <input type="file" className="submit__image-file-input" id="change-img" name="change-img" onChange={(e) => this.changeImage(e)} />
          </div>

          <div className="submit__inner" onSubmit={(e) => this.submitProfile(e)}>
            <form>
              <div className="form-group">
                <label htmlFor="name">ФИО</label>
                <input type="text" id="name" name="name" placeholder="Николай Гоголь" required />
              </div>

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" placeholder="Вид деятельности" />
              </div>

              <div className="form-group">
                <label htmlFor="description">Описание</label>
                <textarea type="text" id="description" name="description" required />
              </div>

              <div className="submit__inner-btn">
                <button className="btn btn-submit">Загрузить</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    );
  }
}