/*global chrome*/
import React,{useState}  from 'react';
const App = () => {
    //const [inputValue, setInputValue] = useState("click button");
    const [responses, setResponses] = useState([]);
  // const handleSendMessage = () => {
  //   // Make a simple request:
  //   // const islogin="yes";
  //   //const url='http://ip.jsontest.com/';
  //   chrome.runtime.sendMessage("ijcednfdjlpgfdpokonoikmclmombnlm", "miheer",
  //   function(response){
  //     //setInputValue(response.data);
  //     console.log("ek don tin");
  //     console.log(typeof response)
  //    alert(response);
  //   }
  //   );
  // };
  //-----------------------------------------------------------
  
    const handleSendMessages2 = async() => {
      //var yesorno="yes";
    
      const newResponses = [];
      for(let i=0;i<3;i++){
      
        var msg={link:"http://ip.jsontest.co/",islogin:"yes", i:i}
      
      await chrome.runtime.sendMessage("knhcggfjgppnkkejgemlpckjknkeohml",msg,
      function(response){
        newResponses.push(response);
        setResponses([...responses, response]);
        setResponses([...responses, ...newResponses]);
      }
      );
      
    };
  }
  

//------------------------------------------------------------

  // const makeChromeRuntimeSendMessage = (message) => {
  //   return new Promise((resolve) => {
  //     chrome.runtime.sendMessage("ijcednfdjlpgfdpokonoikmclmombnlm", message, function (response) {
  //       resolve(response);
  //     });
  //   });
  // };
  
  // const handleSendMessages = async () => {
  //   const newResponses = [];
  //   for(let i=0;i<3;i++){
  //   var response1;
  //   let yesorno="yes";
  //   let msg={link:"http://ip.jsontest.com/",islogin:yesorno, i:i}
  //   try {
  //     response1 = await makeChromeRuntimeSendMessage(msg);
  //     newResponses.push(response1);
  //     //setInputValue(response1);
  //     setResponses([...responses, response1]);
  //   }catch(error){
  //     console.error("Error occurred:", error);
  //   }
  //   setResponses([...responses, ...newResponses]);
  // }
  // };
  //--------------------------------------------------------------
  return (
    <div>
      <h1>click below buttonnnnnnn</h1>
      {/* <h1>{inputValue}</h1> */}
      <div>
        {responses.map((response, index) => (
          <div key={index}>
            <p>{response}</p>
            <h1>----|||||----</h1>
          </div>
        ))}
      </div>
      {/* <button onClick={handleSendMessage}>click for one request</button> */}
      <button onClick={handleSendMessages2}>click for n num of requests</button>
    </div>
  );
};

export default App;
