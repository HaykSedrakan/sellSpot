import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import { useLocation } from 'react-router-dom'
import './Settings.css'
import useUser from '../../hooks/useUser'
import Header from '../Header/Header'
import styles from './Avatar.module.scss'
import axios from 'axios'
import imageCompression from 'browser-image-compression'
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import storage from '../../firebase'
import { MdDateRange } from 'react-icons/md'

function Settings() {
  const { isAuth, user } = useUser()
  const [image, setImage] = useState('')
  const [img, setImg] = useState({})
  const [values, setValues] = useState({
    name: '',
    avatar: {},
    phoneNumber: '',
    id: '',
    password: '',
    email: '',
    bio: '',
  })

  const onInputChange = (e) => {
    setImage(e.target.files[0])
  }

  useEffect(() => {
    if (user) {
      setValues({
        name: user.name || '',
        avatar: user.avatar || {},
        phoneNumber: user.phoneNumber || '',
        id: user.id || '',
        email: user.email || '',
        password: user.password || '',
        bio: user.bio,
      })
    }
  }, [user])

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleEdit = async (id) => {
    try {
      await axios
        .put(`${process.env.REACT_APP_API}/edituser/${id}`, {
          ...values,
          avatar: (img.jpeg || img.webp) && JSON.stringify(img),
        })
        .then(() => {
          console.log('User has been edit success')
          window.location.reload()
        })
        .catch((err) => console.log(err))
    } catch (error) {
      console.log(error)
    }
  }

  async function uploadImage() {
    if (image === null) return

    const newName = image.name + uuid()

    try {
      const compressedImage = await imageCompression(image, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
      })

      const jpegImageRef = ref(storage, `images/avatars/${newName}.jpeg`)
      await uploadBytes(jpegImageRef, compressedImage)

      const webpImage = await createImageBitmap(image)
      const webpCanvas = document.createElement('canvas')
      webpCanvas.width = webpImage.width
      webpCanvas.height = webpImage.height
      const webpCanvasContext = webpCanvas.getContext('2d')
      webpCanvasContext.drawImage(webpImage, 0, 0)

      const webpBlob = await new Promise((resolve) => {
        webpCanvas.toBlob((blob) => resolve(blob), 'image/webp', 0.9)
      })

      if (webpBlob) {
        const webpImageRef = ref(storage, `images/avatars/${newName}.webp`)
        await uploadBytes(webpImageRef, webpBlob)

        const jpegDownloadURL = await getDownloadURL(jpegImageRef)
        const webpDownloadURL = await getDownloadURL(webpImageRef)
        const imgObj = { jpeg: jpegDownloadURL, webp: webpDownloadURL }

        setImg(imgObj)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <Header />
      <section className="settingMain">
        <div className="settingContainer">
          <div className="rounded-lg d-block d-sm-flex">
            <div className="profile-tab-nav border-right">
              <div className="p-4">
                <div className="img-circle text-center mb-3">
                  <div className={styles.avatar}>
                    <img
                      alt='img'
                      className={styles.img}
                      src={
                        !user?.avatar?.jpeg
                          ? '/image/icons/defaultavata.webp'
                          : user?.avatar?.jpeg
                      }
                      onClick={() => document.querySelector('#file').click()}
                    />
                    <button
                      disabled={!image && true}
                      className="btn btn-primary"
                      onClick={() => uploadImage()}>
                      Save
                    </button>
                    <input
                      type="file"
                      id="file"
                      accept="image/*"
                      hidden
                      onChange={onInputChange}
                    />
                  </div>
                </div>
                <h4 className="text-center">{user?.name}</h4>
              </div>
              <div
                className="nav flex-column nav-pills"
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical">
                <a
                  className="nav-link"
                  id="account-tab"
                  data-toggle="pill"
                  href="#account"
                  role="tab"
                  aria-controls="account"
                  aria-selected="true">
                  <i className="fa fa-home text-center mr-1"></i>
                  Account
                </a>
              </div>
            </div>
            <div className="tab-content p-4 p-md-5" id="v-pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="account"
                role="tabpanel"
                aria-labelledby="account-tab">
                <h3 className="mb-4">Account Settings</h3>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group-settings">
                      <label>Full Name</label>
                      <input
                        onChange={handleChange}
                        name="name"
                        type="text"
                        className="form-control"
                        value={values?.name}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        onChange={handleChange}
                        name="email"
                        type="text"
                        className="form-control"
                        value={values?.email}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Phone number</label>
                      <input
                        onChange={handleChange}
                        name="phoneNumber"
                        type="text"
                        className="form-control"
                        value={values?.phoneNumber}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Bio</label>
                      <textarea
                        onChange={handleChange}
                        name="bio"
                        className="form-control"
                        value={values?.bio}
                        rows="4"></textarea>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(values?.id)}>
                    Update
                  </button>
                  <button className="btn btn-light">Cancel</button>
                </div>
                <div className={styles.dateContainer}>
                  <MdDateRange className={styles.icon} />
                  <span className={styles.date}>{user?.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Settings
