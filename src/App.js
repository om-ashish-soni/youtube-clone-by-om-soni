import logo from './logo.PNG';
import home from './home.PNG';
import uploadLogo from './upload.PNG';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import myVideo from './insta_clone.mp4-2021_10_30_14_57_57.mp4';
import { getStorage, ref ,uploadString,uploadBytes,getDownloadURL} from "firebase/storage";
import { collection, addDoc,query,where,getDocs } from "firebase/firestore";
import db from "./firebase";
import {storage} from './firebase';
function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [userid,setUserid]=useState();
  const [isHome, setIsHome] = useState(false);
  const [dp, setDp] = useState();
  const [isUpload, setIsUpload] = useState();
  const [file, setFile] = useState();
  let [channelList, setChannelList] = useState();
  let [videoList, setVideoList] = useState();
  const description = useRef();
  const title = useRef();
  const searchChannel = useRef();
  const searchVideo = useRef();
  const [isVideoList, setIsVideoList] = useState(false);
  const [isChannelList, setIsChannelList] = useState(false);
  const [channelData, setChannelData] = useState({});
  const [isChannelData, setIsChannelData] = useState(false);
  const switchToHome = () => {
    if (isUpload) setIsUpload(false);
    if (isVideoList) setIsVideoList(false);
    if (isChannelData) setIsChannelData(false);
    if (channelList) setIsChannelList(false);
    setIsHome(true);
  }
  const switchToUpload = () => {
    if (isHome) setIsHome(false);
    if (isChannelData) setIsChannelData(false);
    if (isVideoList) setIsVideoList(false);
    if (channelList) setIsChannelList(false);
    setIsUpload(true);
  }
  const switchToChannelList = () => {
    setIsChannelList(false);
    if (isHome) setIsHome(false);
    if (isVideoList) setIsVideoList(false);
    if (isChannelData) setIsChannelData(false);
    if (isUpload) setIsUpload(false);
    setIsChannelList(true);
  }
  const switchToVideoList = () => {
    setIsVideoList(false);
    if (isHome) setIsHome(false);
    if (isUpload) setIsUpload(false);
    if (isChannelData) setIsChannelData(false);
    if (isChannelList) setIsChannelList(false);
    setIsVideoList(true);
  }
  const switchToChannelData = () => {
    setIsChannelData(false);
    if (isHome) setIsHome(false);
    if (isUpload) setIsUpload(false);
    if (isVideoList) setIsVideoList(false);
    if (isChannelList) setIsChannelList(false);
    setIsChannelData(true);
  }
  const usernameChage = (e) => {
    setUsername(e.target.value);
  }
  const passwordChange = (e) => {
    setPassword(e.target.value);
  }
  const handleMediaChange = (e) => {
    alert("uploading video is in progress... , please hit upload button after 30 to 60 seconds")
    e.preventDefault();
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    console.log("handle upload post called");
    if(!file){
      alert("Please choose file");
      return;
    }
    const d=new Date();
    const nowTime=d.getHours()+'_'+d.getMinutes()+'_'+d.getSeconds();
    const nowDate=d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate()+'_'+nowTime;
    const storageRef = ref(storage, `videos/${username}/${file.name}_${nowDate}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded an blob or file!');
      getDownloadURL(storageRef)
      .then((url)=>{
        console.log(url);
        setFile(url)
      })
    });

  }
  const fetchChannel = async(Thischannelname) => {
    // alert("clicked");
    console.log(Thischannelname);
    const idCollectionRef=collection(db,'users');
    const idq=query(idCollectionRef,where("username", "==",Thischannelname));
    const idQuerySnapshot=await getDocs(idq);
    idQuerySnapshot.forEach(idDoc=>{
      const getProductsOfSeller=async()=>{
        console.log("Going to fetch videos...",idDoc.id,Thischannelname);
        const followingsCollectionRef=collection(db,`users/${idDoc.id}/videos`);
        const q=query(followingsCollectionRef);
        const querySnapshot = await getDocs(q);
        const videos=[];
        let index=0;
        if(querySnapshot.size <= 0){
            channelData.channelname=Thischannelname;
            channelData.dp=idDoc.data().dp;
            channelData.videos=videos;
            setIsHome(false);
            switchToChannelData();
        }
        querySnapshot.forEach((doc)=>{
          videos.push({
            "id":doc.id,
            "title":doc.data().title,
            "media":doc.data().media,
            "description":doc.data().description,
            "likes":(doc.data().likes)?(doc.data().likes):(0),
            "channelname":doc.data().channelname
          });
          
          console.log(doc.id,doc.data());
          if(index>=querySnapshot.size - 1){
            console.log(videos);
            channelData.videos=videos;
            channelData.channelname=Thischannelname;
            channelData.dp=idDoc.data().dp;
            setIsHome(false);
            switchToChannelData();
          }
          index++;
        })
        
        console.log("posts : ",videos,channelData);
        
      }
      getProductsOfSeller();
    })
  }
  const submitUpload = async() => {
    console.log("this is file", file);
    const collectionRef=collection(db,`users/${userid}/videos`);
      const docRef=await addDoc(collectionRef,{
        channelname: username,
        media: file,
        description: description.current.value,
        title: title.current.value,
        likes:0
      });
      console.log("added document with id " + docRef.id);
      // alert("uploaded video successfully");
      const lst = [];
      lst.push({
        "id":docRef.id,
        "title":title.current.value,
        "media":file,
        "description":description.current.value,
        "channelname":username,
        "likes":0
      });
      setVideoList(lst);
      console.log(lst);
      switchToVideoList();
    
  }
  const fetchAllVideos=async()=>{
    // alert("going to fetch");
    const collectionRef=collection(db,`users`);
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);
    let index=0;
    const collectedProducts=[];
    querySnapshot.forEach((doc)=>{
      console.log(doc.data().username)
      const collectSellers=async()=>{
        const idCollectionRef=collection(db,'users');
        const idq=query(idCollectionRef,where("username", "==",doc.data().username));
        const idQuerySnapshot=await getDocs(idq);
        idQuerySnapshot.forEach((innerDoc)=>{
          console.log(innerDoc.data().username,innerDoc.id);
          const goIntoSellers=async()=>{
            
            const postCollectionRef=collection(db,`users/${innerDoc.id}/videos`)
            const postq=query(postCollectionRef);
            const postQuerySnapshot=await getDocs(postq);
            postQuerySnapshot.forEach((postDoc)=>{
              collectedProducts.push({
                "id":postDoc.id,
                "title":postDoc.data().title,
                "media":postDoc.data().media,
                "description":postDoc.data().description,
                "channelname":postDoc.data().channelname,
                "likes":(postDoc.data().likes)?(postDoc.data().likes):(0)
              });
            })
          }
          goIntoSellers();
          
        })
      }
      collectSellers();
      setTimeout(()=>{
        if(index>=querySnapshot.size-1){
          console.log(collectedProducts);
          setVideoList(collectedProducts);
          switchToVideoList();
        }
      },2400)
      
      index++;
    })
    
  }
  const submitLogin = async() => {
    console.log("going to log");

    const collectionRef=collection(db,"users");
    const q = query(collectionRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.size <= 0){
      alert("please enter valid data");
      return;
    }
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setDp(doc.data().dp);
      setUserid(doc.id);
      setIsLogged(true);
      setIsHome(true);
      fetchAllVideos();
    });
    
  }
  const submitSignin = async() => {
    console.log("going to signin");
    const docRef = await addDoc(collection(db, "users"), {
      username:username,
      password:password,
      dp:dp
    });
    console.log("Document written with ID: ", docRef.id);
    setUserid(docRef.id);
    setIsLogged(true);
    setIsHome(true);
    fetchAllVideos();
    
  }
  const fetchIncLikesCount = (video) => {
    const url = "http://localhost:2498/incLikes";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "video": video
      })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res == "no") {
          // alert("please enter a valid data");
        } else {

          // setIsLogged(true);
          // setIsHome(true);
        }
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }
  const likeThisVideo = (e, thisVideo) => {
    console.log(e, thisVideo);
    e.target.innerHTML = thisVideo.likes + 1 + " Likes";
    thisVideo.likes += 1;
  }
  const likeThisVideo1 = (e, thisVideo) => {
    console.log(e, thisVideo);
    e.target.innerHTML = thisVideo.likes + 1 + "Likes ";
    thisVideo.likes += 1;
  }
  const uploadDp = (e) => {
    alert("uploading dp is in progress... , please hit signin button after 30 to 60 seconds")
    console.log("uploading dp");
    e.preventDefault();
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    console.log("handle upload post called");
    if(!file){
      alert("Please choose file");
      return;
    }
    const d=new Date();
    const nowTime=d.getHours()+'_'+d.getMinutes()+'_'+d.getSeconds();
    const nowDate=d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate()+'_'+nowTime;
    const storageRef = ref(storage, `dp/${file.name}_${nowDate}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded an blob or file!');
      getDownloadURL(storageRef)
      .then((url)=>{
        console.log(url);
        setDp(url)
      })
    });

  }
  const handleSearchSubmitChannel = (e) => {
    e.preventDefault();
    const url = "http://localhost:2498/fetchChannel";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "searchChannel": searchChannel.current.value
      })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res == "no") {
          alert("please enter a valid data");
          setChannelList([]);
        } else {
          setChannelList(res);
          switchToChannelList();
          console.log(channelList);
        }
        // console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }
  const handleSearchSubmitVideo = async(e) => {
    e.preventDefault();
    const collectionRef=collection(db,`users`);
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);
    let index=0;
    const collectedVideos=[];
    querySnapshot.forEach((doc)=>{
      console.log(doc.data().username)
      const collectSellers=async()=>{
        const idCollectionRef=collection(db,'users');
        const idq=query(idCollectionRef,where("username", "==",doc.data().username));
        const idQuerySnapshot=await getDocs(idq);
        idQuerySnapshot.forEach((innerDoc)=>{
          console.log(innerDoc.data().username,innerDoc.id);
          const goIntoSellers=async()=>{
            
            const postCollectionRef=collection(db,`users/${innerDoc.id}/videos`)
            const postq=query(postCollectionRef);
            const postQuerySnapshot=await getDocs(postq);
            postQuerySnapshot.forEach((postDoc)=>{
              if(postDoc.data().title.toLowerCase().includes(searchVideo.current.value.toLowerCase())){
                collectedVideos.push({
                  "id":postDoc.id,
                  "title":postDoc.data().title,
                  "media":postDoc.data().media,
                  "description":postDoc.data().description,
                  "channelname":postDoc.data().channelname,
                  "likes":postDoc.data().likes
                });
              }
            })
          }
          goIntoSellers();
          
        })
      }
      collectSellers();
      setTimeout(()=>{
        if(index>=querySnapshot.size-1){
          console.log(collectedVideos);
          setVideoList(collectedVideos);
          switchToVideoList();
        }
      },2400)
      
      index++;
    })
    
  }
  return (
    <div className="container">
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      {
        !isLogged ?
          <>
            {
              !isNewUser ?
                <>

                  <div className="container">
                    <div className="loginForm">
                      <div className="container">
                        <img src={logo} className="myfirstlogo" alt="logo" />
                        <br />
                        <br />
                        <br />
                        <center>
                          <input className="inpLogin" onChange={usernameChage} placeholder="channelname / username" />
                          <br />
                          <input type="password" className="inpLogin" onChange={passwordChange} placeholder="password" />
                          <br />
                          <button className="loginBtn" onClick={submitLogin}>Login</button>
                          <br />
                        </center>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <hr />
                  <div className="container">

                    <center>
                      <button className="switchBtn" onClick={() => setIsNewUser(true)}>Not a user? Sign in</button>
                    </center>
                  </div>
                </> :
                <>
                  <div className="container">
                    <div className="signinForm">
                      <br />
                      <br />
                      <img src={logo} className="myfirstlogo" alt="logo" />

                      <br />
                      <br />
                      <br />
                      <center>
                        <input className="inpLogin" type="file" accept="image/*" onChange={uploadDp} />
                        <br />
                        <input className="inpLogin" onChange={usernameChage} placeholder="channelname / username" />
                        <br />
                        <input type="password" className="inpLogin" onChange={passwordChange} placeholder="password" />
                        <br />
                        <button className="loginBtn" onClick={submitSignin}>Sign in</button>
                        <br />
                      </center>
                    </div>
                    <hr />
                    <hr />
                    <div className="container">

                      <center>
                        <button className="switchBtn" onClick={() => setIsNewUser(false)}>Already a user? Log in</button>
                      </center>
                    </div>
                  </div>
                </>
            }
          </> :
          <>
            <div className="container">
              <div className="NavBar">
                <img src={logo} className="navLogo" />
                <form className="searchVideo" onSubmit={handleSearchSubmitVideo}>
                  <input className="inpOfSearch" ref={searchVideo} placeholder="search video" />
                </form>
                
                <img src={home} className="homeBtn" onClick={fetchAllVideos} />
                <img src={uploadLogo} className="uploadBtn" onClick={switchToUpload} />
                <button className="seeProfileBtn" onClick={() => fetchChannel(username)}>@{username}</button>

              </div>
            </div>
            <br />
            {
              isHome ?
                <>



                </> :
                <>
                </>
            }
            {
              isVideoList ?
                <>

                  <div className="container">
                    <span className="searchResultText">
                      <u>Search Result : </u>
                    </span>
                    <br />
                    {/* {console.log("visible videos", videoList)} */}
                    {
                      videoList.map(video => {
                        return (
                          
                          <div className="videoOuter">
                            <ReactPlayer
                              url={video.media}
                              className='react-player'
                              controls={true}
                              width='90%'
                              height='90%'
                            />
                            <span className="videoOuterTitle">{video.title}</span>
                            <br />
                            <button className="seeChannelBtn" onClick={() => fetchChannel(video.channelname)}>@{video.channelname}</button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button className="likeBtn" onClick={(e) => likeThisVideo(e, video)}>{video.likes} Likes</button>
                          </div>
                        )



                      })
                    }
                  </div>
                </> :
                <>
                </>
            }
            {
              isChannelData ?
                <>
                  <div className="container">
                    {/* {console.log(channelData)} */}
                    <img src={channelData.dp} className="dpImageOfChannel" />
                    <div classsName="container">
                      <button className="seeChannelHeading">@{channelData.channelname}</button>
                    </div>
                    <h2><u>videos : </u></h2>
                    <div className="container">
                      {
                        channelData.videos.map(video => {
                          return (
                            <div className="videoOuter">
                              <ReactPlayer
                                url={video.media}
                                className='react-player'
                                controls={true}
                                width='90%'
                                height='90%'
                              />
                              <span className="videoOuterTitle">{video.title}</span>
                              <br />
                              <button className="seeChannelBtn" onClick={() => fetchChannel(video.channelname)}>@{video.channelname}</button>
                              &nbsp;&nbsp;&nbsp;&nbsp;
                              <button className="likeBtn" onClick={(e) => likeThisVideo(e, video)}>{video.likes} Likes</button>
                            </div>
                            // <div className="container">
                            //   <h2>{video.title}</h2>
                            //   <h3>{video.media.substr(17)}</h3>
                            //   <h3>{video.description}</h3>
                            //   <h3>{video.likes}</h3>
                            //   <ReactPlayer
                            //     url={video.media.substr(17)}
                            //     className='react-player'
                            //     controls={true}
                            //   />
                            //   <button className="likeBtn" onClick={(e) => likeThisVideo1(e, video)}>{video.likes} Like</button>
                            //   <button className="seeChannelBtn" onClick={() => fetchChannel(video.channelname)}>{video.channelname}</button>
                            // </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </> :
                <>
                </>
            }
            {
              isChannelList ?
                <>
                  <div className="container">
                    <h1>hello i am channel List</h1>
                    {console.log(channelList)}
                    {
                      channelList.map(channelItr => {
                        return (
                          <div onClick={() => fetchChannel(channelItr.username)}>
                            <img src={channelItr.dp} />
                            <h2>{channelList.username}</h2>
                          </div>

                        )
                      })
                    }

                  </div>
                </> :
                <>
                </>
            }

            {
              isUpload ?
                <>
                  <div className="container">
                    <div className="uploadForm">
                      <input className="inpLogin" type="file"  accept="video/*" onChange={handleMediaChange} />
                      <br />
                      <label >title</label>
                      <br/>
                      <textarea className="inpTextArea" ref={title} />
                      <br />
                      <label >description : </label>
                      <br />
                      <textarea className="inpTextArea" ref={description} />
                      <br />
                      <button className="loginBtn" onClick={submitUpload}>Upload</button>
                    </div>

                  </div>
                </> :
                <>
                </>
            }
          </>
      }
    </div>
  );
}

export default App;

// import logo from './logo.PNG';
// import home from './home.PNG';
// import uploadLogo from './upload.PNG';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import React, { useState, useRef } from 'react';
// import axios from 'axios';
// import ReactPlayer from 'react-player';
// import myVideo from './insta_clone.mp4-2021_10_30_14_57_57.mp4';
// function App() {
//   const [isLogged, setIsLogged] = useState(false);
//   const [isNewUser, setIsNewUser] = useState(false);
//   const [username, setUsername] = useState();
//   const [password, setPassword] = useState();
//   const [isHome, setIsHome] = useState(false);
//   const [dp, setDp] = useState();
//   const [isUpload, setIsUpload] = useState();
//   const [file, setFile] = useState();
//   let [channelList, setChannelList] = useState();
//   let [videoList, setVideoList] = useState();
//   const description = useRef();
//   const title = useRef();
//   const searchChannel = useRef();
//   const searchVideo = useRef();
//   const [isVideoList, setIsVideoList] = useState(false);
//   const [isChannelList, setIsChannelList] = useState(false);
//   const [channelData, setChannelData] = useState();
//   const [isChannelData, setIsChannelData] = useState(false);
//   const switchToHome = () => {
//     if (isUpload) setIsUpload(false);
//     if (isVideoList) setIsVideoList(false);
//     if (isChannelData) setIsChannelData(false);
//     if (channelList) setIsChannelList(false);
//     setIsHome(true);
//   }
//   const switchToUpload = () => {
//     if (isHome) setIsHome(false);
//     if (isChannelData) setIsChannelData(false);
//     if (isVideoList) setIsVideoList(false);
//     if (channelList) setIsChannelList(false);
//     setIsUpload(true);
//   }
//   const switchToChannelList = () => {
//     setIsChannelList(false);
//     if (isHome) setIsHome(false);
//     if (isVideoList) setIsVideoList(false);
//     if (isChannelData) setIsChannelData(false);
//     if (isUpload) setIsUpload(false);
//     setIsChannelList(true);
//   }
//   const switchToVideoList = () => {
//     setIsVideoList(false);
//     if (isHome) setIsHome(false);
//     if (isUpload) setIsUpload(false);
//     if (isChannelData) setIsChannelData(false);
//     if (isChannelList) setIsChannelList(false);
//     setIsVideoList(true);
//   }
//   const switchToChannelData = () => {
//     setIsChannelData(false);
//     if (isHome) setIsHome(false);
//     if (isUpload) setIsUpload(false);
//     if (isVideoList) setIsVideoList(false);
//     if (isChannelList) setIsChannelList(false);
//     setIsChannelData(true);
//   }
//   const usernameChage = (e) => {
//     setUsername(e.target.value);
//   }
//   const passwordChange = (e) => {
//     setPassword(e.target.value);
//   }
//   const handleMediaChange = (e) => {
//     e.preventDefault();
//     const file = e.target.files[0];
//     const formData = new FormData();
//     formData.append('file', file);
//     const url = "http://localhost:2498/media";
//     console.log(formData);
//     axios.post(url, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     }).then(res => {
//       console.log(res);
//       if (res == "no") return;
//       console.log(res.data);
//       setFile(res.data);
//     }).catch(err => {
//       console.log(err);
//     })

//     // console.log(res);

//   }
//   const fetchChannel = (Thischannelname) => {
//     // alert("clicked");
//     console.log(Thischannelname);
//     const url = "http://localhost:2498/fetchChannelData";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         "channelname": Thischannelname
//       })
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         if (res == "no") {
//           alert("can not show the channel");
//         } else {
//           // alert("video uploaded succesfully");
//           console.log(res);
//           setChannelData(res);
//           switchToChannelData();
//         }
//       })
//       .catch(err => {
//         console.log(err);
//       })

//   }
//   const submitUpload = () => {
//     console.log("this is file", file);
//     const url = "http://localhost:2498/upload";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         "username": username,
//         "file": file,
//         "description": description.current.value,
//         "title": title.current.value
//       })
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         if (res == "no") {
//           alert("please enter a valid data");
//         } else {
//           alert("video uploaded succesfully");
//           console.log(res);
//           setVideoList([]);
//           const lst = [];
//           lst.push(res);
//           setVideoList(lst);
//           console.log(lst);
//           switchToVideoList();
//         }
//       })
//       .catch(err => {
//         console.log(err);
//       })

//   }
//   const fetchAllVideos=()=>{
//     alert("going to fetch");
//     const url = "http://localhost:2498/fetchAllVideos";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
        
//       })
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         if (res == "no") {
//           alert("please reload");
//         } else {
//           console.log(res);
//           setVideoList(res);
//           switchToVideoList();
//         }
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }
//   const submitLogin = () => {
//     const url = "http://localhost:2498/login";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         "username": username,
//         "password": password
//       })
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         if (res == "no") {
//           alert("please enter a valid data");
//         } else {
//           setIsLogged(true);
//           setIsHome(true);
//           fetchAllVideos();
//         }
//         console.log(res);
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }
//   const submitSignin = () => {
//     const url = "http://localhost:2498/signin";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         "username": username,
//         "password": password,
//         "dp": dp
//       })
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         if (res == "no") {
//           alert("please enter a valid data");
//         } else {

//           setIsLogged(true);
//           setIsHome(true);
//           fetchAllVideos();
//         }
//         console.log(res);
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }
//   const fetchIncLikesCount = (video) => {
//     const url = "http://localhost:2498/incLikes";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         "video": video
//       })
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         if (res == "no") {
//           // alert("please enter a valid data");
//         } else {

//           // setIsLogged(true);
//           // setIsHome(true);
//         }
//         console.log(res);
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }
//   const likeThisVideo = (e, thisVideo) => {
//     console.log(e, thisVideo);
//     e.target.innerHTML = thisVideo.likes + 1 + " Likes";
//     thisVideo.likes += 1;
//   }
//   const likeThisVideo1 = (e, thisVideo) => {
//     console.log(e, thisVideo);
//     e.target.innerHTML = thisVideo.likes + 1 + "Likes ";
//     thisVideo.likes += 1;
//   }
//   const uploadDp = (e) => {
//     e.preventDefault();
//     const file = e.target.files[0];
//     const formData = new FormData();
//     formData.append('file', file);
//     const url = "http://localhost:2498/media";
//     console.log(formData);
//     axios.post(url, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     }).then(res => {
//       console.log(res.data.substr(17));
//       if (res == "no") return;
//       setDp(res.data.substr(17));

//     }).catch(err => {
//       console.log(err);
//     })

//   }
//   const handleSearchSubmitChannel = (e) => {
//     e.preventDefault();
//     const url = "http://localhost:2498/fetchChannel";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         "searchChannel": searchChannel.current.value
//       })
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         if (res == "no") {
//           alert("please enter a valid data");
//           setChannelList([]);
//         } else {
//           setChannelList(res);
//           switchToChannelList();
//           console.log(channelList);
//         }
//         // console.log(res);
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }
//   const handleSearchSubmitVideo = (e) => {
//     e.preventDefault();
//     const url = "http://localhost:2498/fetchVideo";
//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         "searchVideo": searchVideo.current.value
//       })
//     }
//     fetch(url, options)
//       .then(res => res.json())
//       .then(res => {
//         if (res == "no") {
//           alert("please enter a valid data");
//           setVideoList([]);
//         } else {
//           setVideoList(res);
//           console.log(videoList);
//           switchToVideoList();
//         }
//         // console.log(res);
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }
//   return (
//     <div className="container">
//       {/* <img src={logo} className="App-logo" alt="logo" /> */}
//       {
//         !isLogged ?
//           <>
//             {
//               !isNewUser ?
//                 <>

//                   <div className="container">
//                     <div className="loginForm">
//                       <div className="container">
//                         <img src={logo} className="myfirstlogo" alt="logo" />
//                         <br />
//                         <br />
//                         <br />
//                         <center>
//                           <input className="inpLogin" onChange={usernameChage} placeholder="channelname / username" />
//                           <br />
//                           <input className="inpLogin" onChange={passwordChange} placeholder="password" />
//                           <br />
//                           <button className="loginBtn" onClick={submitLogin}>Login</button>
//                           <br />
//                         </center>
//                       </div>
//                     </div>
//                   </div>
//                   <hr />
//                   <hr />
//                   <div className="container">

//                     <center>
//                       <button className="switchBtn" onClick={() => setIsNewUser(true)}>Not a user? Sign in</button>
//                     </center>
//                   </div>
//                 </> :
//                 <>
//                   <div className="container">
//                     <div className="signinForm">
//                       <br />
//                       <br />
//                       <img src={logo} className="myfirstlogo" alt="logo" />

//                       <br />
//                       <br />
//                       <br />
//                       <center>
//                         <input className="inpLogin" type="file" onChange={uploadDp} />
//                         <br />
//                         <input className="inpLogin" onChange={usernameChage} placeholder="channelname / username" />
//                         <br />
//                         <input className="inpLogin" onChange={passwordChange} placeholder="password" />
//                         <br />
//                         <button className="loginBtn" onClick={submitSignin}>Sign in</button>
//                         <br />
//                       </center>
//                     </div>
//                     <hr />
//                     <hr />
//                     <div className="container">

//                       <center>
//                         <button className="switchBtn" onClick={() => setIsNewUser(false)}>Not a user? Sign in</button>
//                       </center>
//                     </div>
//                   </div>
//                 </>
//             }
//           </> :
//           <>
//             <div className="container">
//               <div className="NavBar">
//                 <img src={logo} className="navLogo" />
//                 <form className="searchVideo" onSubmit={handleSearchSubmitVideo}>
//                   <input className="inpOfSearch" ref={searchVideo} placeholder="search video" />
//                 </form>
                
//                 <img src={home} className="homeBtn" onClick={switchToHome} />
//                 <img src={uploadLogo} className="uploadBtn" onClick={switchToUpload} />
//                 <button className="seeProfileBtn" onClick={() => fetchChannel(username)}>@{username}</button>

//               </div>
//             </div>
//             <br />
//             {
//               isHome ?
//                 <>



//                 </> :
//                 <>
//                 </>
//             }
//             {
//               isVideoList ?
//                 <>

//                   <div className="container">
//                     <span className="searchResultText">
//                       <u>Search Result : </u>
//                     </span>
//                     <br />
//                     {/* {console.log("visible videos", videoList)} */}
//                     {
//                       videoList.map(video => {
//                         return (
//                           <div className="videoOuter">
//                             <ReactPlayer
//                               url={video.media.substr(17)}
//                               className='react-player'
//                               controls={true}
//                               width='90%'
//                               height='90%'
//                             />
//                             <span className="videoOuterTitle">{video.title}</span>
//                             <br />
//                             <button className="seeChannelBtn" onClick={() => fetchChannel(video.channelname)}>@{video.channelname}</button>
//                             &nbsp;&nbsp;&nbsp;&nbsp;
//                             <button className="likeBtn" onClick={(e) => likeThisVideo(e, video)}>{video.likes} Likes</button>
//                           </div>
//                         )



//                       })
//                     }
//                   </div>
//                 </> :
//                 <>
//                 </>
//             }
//             {
//               isChannelData ?
//                 <>
//                   <div className="container">
//                     {/* {console.log(channelData)} */}
//                     <img src={channelData.dp} className="dpImageOfChannel" />
//                     <div classsName="container">
//                       <button className="seeChannelHeading">@{channelData.channelname}</button>
//                     </div>
//                     <h2><u>videos : </u></h2>
//                     <div className="container">
//                       {
//                         channelData.videos.map(video => {
//                           return (
//                             <div className="videoOuter">
//                               <ReactPlayer
//                                 url={video.media.substr(17)}
//                                 className='react-player'
//                                 controls={true}
//                                 width='90%'
//                                 height='90%'
//                               />
//                               <span className="videoOuterTitle">{video.title}</span>
//                               <br />
//                               <button className="seeChannelBtn" onClick={() => fetchChannel(video.channelname)}>@{video.channelname}</button>
//                               &nbsp;&nbsp;&nbsp;&nbsp;
//                               <button className="likeBtn" onClick={(e) => likeThisVideo(e, video)}>{video.likes} Likes</button>
//                             </div>
//                             // <div className="container">
//                             //   <h2>{video.title}</h2>
//                             //   <h3>{video.media.substr(17)}</h3>
//                             //   <h3>{video.description}</h3>
//                             //   <h3>{video.likes}</h3>
//                             //   <ReactPlayer
//                             //     url={video.media.substr(17)}
//                             //     className='react-player'
//                             //     controls={true}
//                             //   />
//                             //   <button className="likeBtn" onClick={(e) => likeThisVideo1(e, video)}>{video.likes} Like</button>
//                             //   <button className="seeChannelBtn" onClick={() => fetchChannel(video.channelname)}>{video.channelname}</button>
//                             // </div>
//                           )
//                         })
//                       }
//                     </div>
//                   </div>
//                 </> :
//                 <>
//                 </>
//             }
//             {
//               isChannelList ?
//                 <>
//                   <div className="container">
//                     <h1>hello i am channel List</h1>
//                     {console.log(channelList)}
//                     {
//                       channelList.map(channelItr => {
//                         return (
//                           <div onClick={() => fetchChannel(channelItr.username)}>
//                             <img src={channelItr.dp} />
//                             <h2>{channelList.username}</h2>
//                           </div>

//                         )
//                       })
//                     }

//                   </div>
//                 </> :
//                 <>
//                 </>
//             }

//             {
//               isUpload ?
//                 <>
//                   <div className="container">
//                     <div className="uploadForm">
//                       <input className="inpLogin" type="file" onChange={handleMediaChange} />
//                       <br />
//                       <label>title</label>
//                       <textarea className="inpTextArea" ref={title} />
//                       <br />
//                       <label >description : </label>
//                       <textarea className="inpTextArea" ref={description} />
//                       <br />
//                       <button className="loginBtn" onClick={submitUpload}>Upload</button>
//                     </div>

//                   </div>
//                 </> :
//                 <>
//                 </>
//             }
//           </>
//       }
//     </div>
//   );
// }

// export default App;
