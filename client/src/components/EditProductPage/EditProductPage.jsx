import React, { useEffect, useState } from 'react'
import styles from './EditProductPage.module.scss'
import Header from '../Header/Header'
import { Radio, RadioGroup } from 'rsuite'
import { SelectPicker } from 'rsuite'
import { Select, Space } from 'antd'
import NumericInput from '../AddProductPage/Numeric'
import { Input } from 'antd'
import storage from '../../firebase'
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage'
import { toast } from 'react-toastify'
import imageCompression from 'browser-image-compression'
import { v4 as uuid } from 'uuid'
import { AiOutlineCloudUpload, AiOutlineClose } from 'react-icons/ai'
import { UploadOutlined } from '@ant-design/icons'
import { Button, message, Upload } from 'antd'
import { RotatingLines } from 'react-loader-spinner'
import { FiX } from 'react-icons/fi'
import useUser from '../../hooks/useUser'
import axios from 'axios'
import '../AddProductPage/Rsuite.css'
import { useLocation, useNavigate } from 'react-router-dom'

const currencyData = {
  currency: ['$ (USD)', '֏ (AMD)', '₽ (RUB)'],
}

const data = [
  'Երևան',
  'Արմավիր',
  'Արարատ',
  'Կոտայք',
  'Շիրակ',
  'Լոռի',
  'Սյունիք',
  'Տավուշ',
  'Արագածոտն',
  'Վայոց Զոր',
].map((item) => ({ label: item, value: item }))

export default function EditProductPage() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isAuth, user } = useUser()
  const [img, setImg] = useState([])
  const [image, setImage] = useState(null)
  const [name, setName] = useState('')
  const [value, setValue] = useState('Վաճառք')
  const [place, setPlace] = useState(null)
  const [cities, setCities] = useState(currencyData.currency)
  const [currency, setCurrency] = useState(currencyData.currency[0])
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imgLoader, setImgLoader] = useState(false)
  const [textSendButton, setTextSendButton] = useState('Send')
  const [activeClass, setActiveClass] = useState(false)
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])

  const productId = pathname.split('/')[3]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API}/categories`)
        res.data &&
          setCategories(
            res.data
              .filter((item) => !item.disabled)
              .map((item) => {
                return {
                  id: item.id,
                  disabled: item.disabled,
                  category: item.category,
                  label: item.category,
                }
              })
          )
      } catch (error) {
        console.log(error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API}/productsNew`)
        const filteredDatas =
          res.data && res.data.filter((item) => item.id === +productId)

        setName(filteredDatas[0]?.title)
        setCurrency(filteredDatas[0]?.currency)
        setPrice(filteredDatas[0]?.price)
        setPlace(filteredDatas[0]?.location)
        setValue(filteredDatas[0]?.type)
        setDescription(filteredDatas[0]?.description)
        setImg(JSON.parse(filteredDatas[0]?.img))
        setCategory(filteredDatas[0]?.category)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProduct()
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    try {
      await axios
        .put(`${process.env.REACT_APP_API}/editProduct/${+productId}`, {
          location: place && place,
          img: img && JSON.stringify(img),
          price: price && price,
          title: name && name,
          type: value && value,
          description: description && description,
          currency: currency && currency,
        })
        .then(() => {
          setActiveClass(true)
          navigate('/cabinet/active')
        })
    } catch (error) {
      console.log(error)
    }
  }

  const handleCityChange = (value) => {
    setCurrency(value)
  }

  const onInputChange = (e) => {
    setImage(e.target.files)
  }

  const { TextArea } = Input

  const handleDeleteImg = (jpeg) => {
    console.log(jpeg)
    setImg([...img.filter((item) => item?.jpeg !== jpeg)])
  }
  useEffect(() => {
    const addInFirebase = async () => {
      let newFileNames = []
      let downloadURLs = []

      for (let i = 0; i < image?.length; i++) {
        setImgLoader(true)
        const file = image[i]
        const newFileName = uuid() + '.' + file.name.split('.').pop()
        newFileNames.push(newFileName)

        const jpegImageRef = ref(
          storage,
          `images/testProducts/${newFileName}.jpeg`
        )
        const webpImageRef = ref(
          storage,
          `images/testProducts/${newFileName}.webp`
        )

        try {
          const compressedImage = await imageCompression(file, {
            maxSize: 500 * 1024,
            maxWidthOrHeight: 800,
          })

          const jpegCompressedImage = await imageCompression(compressedImage, {
            fileType: 'jpeg',
          })

          const webpCompressedImage = await imageCompression(compressedImage, {
            fileType: 'webp',
          })

          await uploadBytes(jpegImageRef, jpegCompressedImage)
          await uploadBytes(webpImageRef, webpCompressedImage).then(() => {
            toast.success('Image uploaded successfully!')
          })

          const jpegDownloadURL = await getDownloadURL(jpegImageRef)
          const webpDownloadURL = await getDownloadURL(webpImageRef)

          const imgObj = { jpeg: jpegDownloadURL, webp: webpDownloadURL }
          downloadURLs.push(imgObj)
          setImgLoader(false)
        } catch (error) {
          toast.error(error.message)
          setImgLoader(false)
        }
      }

      setImg((prev) => [...prev, ...downloadURLs])
    }
    addInFirebase()
  }, [image])

  function handleChangeName(e) {
    setName(e.target.value)
  }

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.actions}>
            <div className={styles.typeContainer}>
              <div className={styles.typeContainer_title}>Կատեգորիա</div>
              <div className={styles.typeContainer_types}>
                <SelectPicker
                  value={category}
                  onChange={setCategory}
                  data={categories}
                  style={{ width: 224 }}
                />
              </div>
            </div>
            <div className={styles.typeContainer}>
              <div className={styles.typeContainer_title}>
                Հայտարարության տեսակը
              </div>
              <div className={styles.typeContainer_types}>
                <RadioGroup
                  inline
                  name="radio-name"
                  value={value}
                  onChange={setValue}>
                  <Radio value="Վաճառք">Վաճառք</Radio>
                  <Radio value="Փոխանակում">Փոխանակում</Radio>
                  <Radio value="Փնտրում">Փնտրում եմ</Radio>
                </RadioGroup>
              </div>
            </div>
            <div className={styles.typeContainer}>
              <div className={styles.typeContainer_title}>Գտնվելու վայրը</div>
              <div className={styles.typeContainer_types}>
                <SelectPicker
                  value={place}
                  onChange={setPlace}
                  data={data}
                  style={{ width: 224 }}
                />
              </div>
            </div>
            <div className={styles.typeContainer}>
              <div className={styles.typeContainer_title}>Գին</div>
              <div className={styles.typeContainer_types}>
                <p className={styles.priceLabel}>Գին</p>
                <Space wrap>
                  <NumericInput
                    style={{
                      width: 120,
                    }}
                    value={price}
                    onChange={setPrice}
                  />
                  <Select
                    style={{
                      width: 120,
                    }}
                    value={currency}
                    onChange={handleCityChange}
                    options={cities?.map((city) => ({
                      label: city,
                      value: city,
                    }))}
                  />
                </Space>
              </div>
              <div className={styles.typeContainer}>
                <div className={styles.typeContainer_title}>
                  Մանրամասն տեղեկություն
                </div>
                <div className={styles.typeContainer_types}>
                  <p className={styles.priceLabel}>Անվանում</p>

                  <Input
                    placeholder="Ապռանքի Անունը"
                    onChange={handleChangeName}
                    value={name}
                  />
                </div>
              </div>
              <div className={`${styles.typeContainer}`}>
                <div
                  className={`${styles.typeContainer_types} ${styles.typeContainerStart}`}>
                  <p className={styles.priceLabel}>Նկարագիր</p>

                  <TextArea
                    rows={6}
                    showCount
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    style={{ resize: 'none' }}
                    placeholder="Մանրամասն նկարագրեք ձեր ապրանքատեսակը, նրա առավելությունները, թերությունները և ցանկացած այլ տեղեկատվություն, որը կօգնի գնորդին ճիշտ որոշում կայացնել:"
                    maxLength={6000}
                  />
                </div>
              </div>
              <div className={`${styles.typeContainer}`}>
                <input
                  multiple
                  type="file"
                  id="file"
                  accept="image/*"
                  hidden
                  onChange={onInputChange}
                />
                <div
                  className={`${styles.typeContainer_types} ${styles.typeContainerStart}`}>
                  <p className={styles.priceLabel}>Լուսանկարներ</p>
                  <button
                    className={styles.selectImage}
                    onClick={() => document.querySelector('#file').click()}>
                    Select Image
                  </button>
                </div>
              </div>
              <div className={styles.typeContainer}>
                <div className={styles.typeContainer_types}>
                  <div className={styles.imageContainer}>
                    {img &&
                      img?.map((image) => (
                        <div className={styles.imgWrapper}>
                          <img src={image?.jpeg} className={styles.image} />
                          <button
                            onClick={() => handleDeleteImg(image?.jpeg)}
                            className={styles.deleteButton}>
                            <FiX className={styles.deleteIcon} />
                          </button>
                        </div>
                      ))}
                    {imgLoader && (
                      <div className={styles.loaderContainer}>
                        <RotatingLines
                          strokeColor="#5b0eeb"
                          strokeWidth="5"
                          animationDuration="0.75"
                          width="40"
                          visible={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.sendButtonContainer}>
            <div
              className={`${styles.btnWrap} ${activeClass && styles.active}`}>
              <button onClick={handleSend} className={styles.btn}>
                <span className={styles.text}>Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
