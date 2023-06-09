import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './Cabinet.css'
import Header from '../Header/Header'
import { Link } from 'react-router-dom'
import { MdLocationPin } from 'react-icons/md'
import { BiArrowToTop } from 'react-icons/bi'
import { CgClose } from 'react-icons/cg'
import { BiEdit } from 'react-icons/bi'
import { ImHome, ImArrowUp2 } from 'react-icons/im'
import { FaEye } from 'react-icons/fa'
import { BsCalendar } from 'react-icons/bs'
import './Active.css'
import useUser from '../../hooks/useUser'

function Active() {
  const { isAuth, user } = useUser()
  const [active, setActive] = useState(true)
  const [activeButton, setActiveButton] = useState(true)
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchValue = searchParams.get('search')

  const handleActiveTabToggle = (id) => {
    setActiveButton(id)
  }
  const handleactiveToggle = () => {
    setActive(!active)
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API}/productsNew`)
        const filterData =
          res.data &&
          res.data
            .filter((item) => item?.userId == user?.id)
            .map((item) => {
              return {
                price: item.price,
                description: item.description,
                currency: item.currency,
                location: item.location,
                img: JSON.parse(item.img),
                userId: item.userId,
                id: item.id,
                title: item.title,
                type: item.type,
              }
            })

        setProducts(filterData)
      } catch (error) {
        console.log(error)
      }
    }
    fetch()
  }, [user])

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await axios.get(`${process.env.REACT_APP_API}/products`)
  //       res.data && setProducts(res.data.slice(0, 100))
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   fetchProducts()
  // }, [])

  const handleNavigate = (id) => {
    navigate(`/product/details/${id}`)
  }

  async function handleDeleteProduct(id) {
    try {
      await axios.delete(`${process.env.REACT_APP_API}/deleteproduct/${id}`)
      .then(() => window.location.reload())
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <Header />
      <div className="main">
        <div className="cabinetContainer">
          <div className="pageTab">
            <div
              onClick={() => handleactiveToggle()}
              className={`ownAdverts ${active ? 'active' : ''}`}>
              Ads
            </div>
          </div>
          <div className="tabBody">
            <div className="tabBar">
              <Link to={'/cabinet/active'}>
                <div
                  className={`activeBar ${
                    activeButton === 'active' ? 'active' : ''
                  }`}
                  onClick={() => handleActiveTabToggle('active')}>
                  Active
                </div>
              </Link>
              <Link to={'/cabinet/inactive'}>
                <div
                  className={`inActiveBar ${
                    activeButton === 'inactive' ? 'active' : ''
                  }`}
                  onClick={() => handleActiveTabToggle('inactive')}>
                  Inactive
                </div>
              </Link>
            </div>
            <div className="cabinetAds">
              {products.length &&
                products.map((item) => (
                  <div className="cabinetAd">
                    <div className="cabinetImgDiv">
                      <img
                        src={item?.img[0]?.jpeg}
                        alt="img"
                        className="cabinetImg"
                      />
                    </div>
                    <div className="cabinetInfoDiv">
                      <div className="cabinetTitle">{item?.title}</div>
                      <div className="cabinetLocation">location</div>
                      <div className="s">
                        <div className="cabinetPrice">
                          {item?.price} {item?.currency}
                        </div>
                        <div className="cabinetDays">
                          {' '}
                          <BsCalendar /> 55 days
                        </div>
                        <div className="cabinetWatched">
                          <FaEye /> 135
                        </div>
                      </div>
                      <div className="cabinetIcons">
                        <div className="cabinetIcon addTop">
                          {' '}
                          <BiArrowToTop className="toTopIcon" />
                          <div className="addTopText">Add To Top</div>
                        </div>
                        <div className="cabinetIcon addHome">
                          <ImHome className="toHomeIcon" />
                          <div className="addHomeText">Add To Home</div>
                        </div>
                      </div>
                      <div className="cabinetAdIcons">
                        <Link
                          to={`/edit/product/${item.id}`}
                          className="cabinetEdit">
                          <BiEdit className="i" />
                        </Link>
                        <div className="cabinetDelete">
                          <CgClose
                            className="i"
                            onClick={() => handleDeleteProduct(item?.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Active
