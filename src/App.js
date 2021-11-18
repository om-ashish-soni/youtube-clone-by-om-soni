import logo from './logo.PNG';
import home from './home.PNG';
import uploadLogo from './upload.PNG';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import myVideo from './insta_clone.mp4-2021_10_30_14_57_57.mp4';
function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
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
  const [channelData, setChannelData] = useState();
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
    e.preventDefault();
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    const url = "http://localhost:2498/media";
    console.log(formData);
    axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      console.log(res);
      if (res == "no") return;
      console.log(res.data);
      setFile(res.data);
    }).catch(err => {
      console.log(err);
    })

    // console.log(res);

  }
  const fetchChannel = (Thischannelname) => {
    // alert("clicked");
    console.log(Thischannelname);
    const url = "http://localhost:2498/fetchChannelData";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "channelname": Thischannelname
      })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res == "no") {
          alert("can not show the channel");
        } else {
          // alert("video uploaded succesfully");
          console.log(res);
          setChannelData(res);
          switchToChannelData();
        }
      })
      .catch(err => {
        console.log(err);
      })

  }
  const submitUpload = () => {
    console.log("this is file", file);
    const url = "http://localhost:2498/upload";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "username": username,
        "file": file,
        "description": description.current.value,
        "title": title.current.value
      })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res == "no") {
          alert("please enter a valid data");
        } else {
          alert("video uploaded succesfully");
          console.log(res);
          setVideoList([]);
          const lst = [];
          lst.push(res);
          setVideoList(lst);
          console.log(lst);
          switchToVideoList();
        }
      })
      .catch(err => {
        console.log(err);
      })

  }
  const fetchAllVideos=()=>{
    alert("going to fetch");
    const url = "http://localhost:2498/fetchAllVideos";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        
      })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res == "no") {
          alert("please reload");
        } else {
          console.log(res);
          setVideoList(res);
          switchToVideoList();
        }
      })
      .catch(err => {
        console.log(err);
      })
  }
  const submitLogin = () => {
    const url = "http://localhost:2498/login";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "username": username,
        "password": password
      })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res == "no") {
          alert("please enter a valid data");
        } else {
          setIsLogged(true);
          setIsHome(true);
          fetchAllVideos();
        }
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }
  const submitSignin = () => {
    const url = "http://localhost:2498/signin";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "username": username,
        "password": password,
        "dp": dp
      })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res == "no") {
          alert("please enter a valid data");
        } else {

          setIsLogged(true);
          setIsHome(true);
          fetchAllVideos();
        }
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
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
    e.preventDefault();
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    const url = "http://localhost:2498/media";
    console.log(formData);
    axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      console.log(res.data.substr(17));
      if (res == "no") return;
      setDp(res.data.substr(17));

    }).catch(err => {
      console.log(err);
    })

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
  const handleSearchSubmitVideo = (e) => {
    e.preventDefault();
    const url = "http://localhost:2498/fetchVideo";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "searchVideo": searchVideo.current.value
      })
    }
    fetch(url, options)
      .then(res => res.json())
      .then(res => {
        if (res == "no") {
          alert("please enter a valid data");
          setVideoList([]);
        } else {
          setVideoList(res);
          console.log(videoList);
          switchToVideoList();
        }
        // console.log(res);
      })
      .catch(err => {
        console.log(err);
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
                          <input className="inpLogin" onChange={passwordChange} placeholder="password" />
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
                        <input className="inpLogin" type="file" onChange={uploadDp} />
                        <br />
                        <input className="inpLogin" onChange={usernameChage} placeholder="channelname / username" />
                        <br />
                        <input className="inpLogin" onChange={passwordChange} placeholder="password" />
                        <br />
                        <button className="loginBtn" onClick={submitSignin}>Sign in</button>
                        <br />
                      </center>
                    </div>
                    <hr />
                    <hr />
                    <div className="container">

                      <center>
                        <button className="switchBtn" onClick={() => setIsNewUser(false)}>Not a user? Sign in</button>
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
                
                <img src={home} className="homeBtn" onClick={switchToHome} />
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
                              url={video.media.substr(17)}
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
                                url={video.media.substr(17)}
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
                      <input className="inpLogin" type="file" onChange={handleMediaChange} />
                      <br />
                      <label>title</label>
                      <textarea className="inpTextArea" ref={title} />
                      <br />
                      <label >description : </label>
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
