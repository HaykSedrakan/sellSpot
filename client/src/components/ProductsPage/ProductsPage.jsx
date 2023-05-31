import './ProductsPage.scss'
import Header from '../Header/Header'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

import { MdFormatListBulleted } from 'react-icons/md'
import { ImTable2 } from 'react-icons/im'
import { MdLocationPin } from 'react-icons/md'

export default function ProductsPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchValue = searchParams.get('search')

  console.log(searchValue)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API}/productsNew`)
        const filteredDatas =
          res.data &&
          res.data
            .filter((item) =>
              item?.title.toLowerCase().includes(searchValue.toLowerCase())
            )
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
        setProducts(filteredDatas)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProducts()
  }, [])

  const handleNavigate = (id) => {
    navigate(`/product/details/${id}`)
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="content">
          <div className="filters">
            <div className="show-type">
              <div className="show-type__icons">
                <div className="row-icon">
                  <MdFormatListBulleted />
                </div>
                <div className="cell-icon">
                  <ImTable2 />
                </div>
              </div>
            </div>
            <div className="sorts">
              <div className="currency">Currency</div>
              <div className="catagory">Category</div>
            </div>
          </div>
          <div className="adverts-div">
            <div className="adverts-title">Adverts</div>
            <div className="adverts">
              {products &&
                products.map((item) => (
                  <div
                    className="advert"
                    onClick={() => handleNavigate(item?.id)}
                    key={item?.id}
                  >
                    <div className="img-div">
                      <img
                        alt="img"
                        src={item?.img[0]?.jpeg}
                        className="advert-img"
                      />
                    </div>
                    <div className="info-div">
                      <div className="title-div">{item?.title}</div>
                      <div className="price-div">
                        {item?.currency === "$ (USD)" ? "$" : "֏"}
                        {item?.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                      </div>
                      <div className="location-div">
                        {<MdLocationPin className="location-icon" />}{" "}
                        <span className="location-title">{item?.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
