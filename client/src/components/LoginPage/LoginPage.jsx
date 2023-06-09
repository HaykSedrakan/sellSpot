// import styles from "./LoginPage.module.css";
// import { FaUser } from "react-icons/fa";
// import { HiLockClosed } from "react-icons/hi";
// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import { RiAdminFill } from "react-icons/ri";
// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";
// import { MdOutlineAccountCircle, MdAlternateEmail } from "react-icons/md";
// import { BsFillKeyFill, BsTelephoneFill } from "react-icons/bs";
// import dayjs from "dayjs";

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [loginValues, setLoginValues] = useState({
//     email: "",
//     password: "",
//   });
//   const [authValues, setAuthValues] = useState({
//     email: "",
//     password: "",
//     name: "",
//     phoneNumber: "",
//     date: dayjs().format("DD.MM.YYYY"),
//   });
//   const [completedAuth, setCompleteAuth] = useState(false);

//   const handleLoginChange = (e) => {
//     setLoginValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };
//   const handleAuthChange = (e) => {
//     setAuthValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   axios.defaults.withCredentials = true;

//   const handleSubmitLogin = (e) => {
//     e.preventDefault();

//     axios
//       .post(`${process.env.REACT_APP_API}/login`, loginValues && loginValues, {
//         withCredentials: true,
//         sameSite: "none",
//       })

//       .then((res) => {
//         if (res.data.Status === "Success") {
//           navigate("/");
//         } else {
//           alert(res.data.Error);
//         }
//       })
//       .catch((err) => console.log(err));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     axios
//       .post(`${process.env.REACT_APP_API}/register`, authValues && authValues)
//       .then((res) => {
//         if (res.data.Status === "Success") {
//           navigate("/login");
//           setCompleteAuth(true);
//         } else {
//           alert("Error !");
//         }
//       });
//   };

//   return (
//     <>
//       <div className={styles.section}>
//         <div className={styles.container}>
//           <div
//             className={`${styles.row} ${styles["full-height"]} ${styles["justify-content-center"]}`}
//           >
//             <div
//               className={`${styles.col}-12 ${styles["text-center"]} ${styles["align-self-center"]} ${styles.py}-5`}
//             >
//               <div
//                 className={`${styles.section} ${styles["pb-5"]} ${styles["pt-5"]} ${styles["pt-sm-2"]} ${styles["text-center"]}`}
//               >

//                 <div
//                   className={styles["card-3d-wrap"]}
//                   style={{ margin: "auto" }}
//                 >
//                   <div
//                     className={`${styles["card-3d-wrapper"]} ${
//                       completedAuth && styles.rotate
//                     } `}
//                   >
//                     <div className={styles["card-front"]}>
//                       <div className={styles["center-wrap"]}>
//                         <div
//                           className={` ${styles.section} ${styles["text-center"]}`}
//                         >
//                           <h4
//                             className={` ${styles.loginTitle} ${styles.mb}-4 ${styles.pb}-3`}
//                           >
//                             Log In
//                           </h4>
//                           <div className={styles["form-group"]}>
//                             <input
//                               type="email"
//                               name="email"
//                               className={styles["form-style"]}
//                               placeholder="E-Mail"
//                               id="email"
//                               autoComplete="off"
//                               onChange={handleLoginChange}
//                             />
//                             <MdAlternateEmail
//                               className={`${styles["input-icon"]} uil uil-at`}
//                             />
//                           </div>
//                           <div
//                             className={`${styles["form-group"]} ${styles.mt}-2`}
//                           >
//                             <input
//                               type="password"
//                               name="password"
//                               className={styles["form-style"]}
//                               placeholder="Password"
//                               id="logpass"
//                               autoComplete="off"
//                               onChange={handleLoginChange}
//                             />
//                             <BsFillKeyFill
//                               className={`${styles["input-icon"]} uil uil-lock-alt`}
//                             />
//                           </div>
//                           <div className={styles.btnContainer}>
//                             {" "}
//                             <button
//                               onClick={handleSubmitLogin}
//                               className={`${styles.btn} ${styles.mt}-4`}
//                             >
//                               Login
//                             </button>
//                           </div>
//                     <Link to={"/signup"} className={styles.signupLink}>SignUp</Link>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import styles from "./LoginPage.module.css";
import { FaUser } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { RiAdminFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { MdOutlineAccountCircle, MdAlternateEmail } from "react-icons/md";
import { BsFillKeyFill, BsTelephoneFill } from "react-icons/bs";
import dayjs from "dayjs";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });
  const [authValues, setAuthValues] = useState({
    email: "",
    password: "",
    name: "",
    phoneNumber: "",
    date: dayjs().format("DD.MM.YYYY"),
  });
  const [completedAuth, setCompleteAuth] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isValidEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginChange = (e) => {
  const { name, value } = e.target;
  setLoginValues((prev) => ({ ...prev, [name]: value }));

  if (name === "email") {
    if (!value) {
      setEmailError("Email is required");
    } else if (!isValidEmail(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  }

  if (name === "password") {
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  }
  };

  const handleAuthChange = (e) => {
    setAuthValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  axios.defaults.withCredentials = true;

  const handleSubmitLogin = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API}/login`, loginValues && loginValues, {
        withCredentials: true,
        sameSite: "none",
      })

      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API}/register`, authValues && authValues)
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/login");
          setCompleteAuth(true);
        } else {
          alert("Error !");
        }
      });
  };

  return (
    <>
      <div className={styles.section}>
        <div className={styles.container}>
          <div
            className={`${styles.row} ${styles["full-height"]} ${styles["justify-content-center"]}`}
          >
            <div
              className={`${styles.col}-12 ${styles["text-center"]} ${styles["align-self-center"]} ${styles.py}-5`}
            >
              <div
                className={`${styles.section} ${styles["pb-5"]} ${styles["pt-5"]} ${styles["pt-sm-2"]} ${styles["text-center"]}`}
              >
                <div
                  className={styles["card-3d-wrap"]}
                  style={{ margin: "auto" }}
                >
                  <div
                    className={`${styles["card-3d-wrapper"]} ${
                      completedAuth && styles.rotate
                    } `}
                  >
                    <div className={styles["card-front"]}>
                      <div className={styles["center-wrap"]}>
                        <div
                          className={` ${styles.section} ${styles["text-center"]}`}
                        >
                          <h4
                            className={` ${styles.loginTitle} ${styles.mb}-4 ${styles.pb}-3`}
                          >
                            Log In
                          </h4>
                          <div className={styles["form-group"]}>
                            <input
                              type="email"
                              name="email"
                              className={styles["form-style"]}
                              placeholder="E-Mail"
                              id="email"
                              autoComplete="off"
                              onChange={handleLoginChange}
                            />
                            <MdAlternateEmail
                              className={`${styles["input-icon"]} uil uil-at`}
                            />
                            {emailError && (
                              <span className={styles.error}>{emailError}</span>
                            )}
                          </div>
                          <div
                            className={`${styles["form-group"]} ${styles.mt}-2`}
                          >
                            <input
                              type="password"
                              name="password"
                              className={styles["form-style"]}
                              placeholder="Password"
                              id="logpass"
                              autoComplete="off"
                              onChange={handleLoginChange}
                            />
                            <BsFillKeyFill
                              className={`${styles["input-icon"]} uil uil-lock-alt`}
                            />
                          </div>
                          <div className={styles.btnContainer}>
                            {" "}
                            <button
                              onClick={handleSubmitLogin}
                              className={`${styles.btn} ${styles.mt}-4`}
                            >
                              Login
                            </button>
                          </div>
                          <Link to={"/signup"} className={styles.signupLink}>
                            SignUp
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
