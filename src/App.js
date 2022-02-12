import './App.css';
import Rank from './Rank';
import { useState, useEffect, useRef} from "react";
import keyclear from './keyclear.png';
import ClearIcon from '@mui/icons-material/Clear';
import ShareIcon from '@mui/icons-material/Share';
import {Snackbar, SnackbarContent, Fade, Button, Dialog, DialogContent} from '@mui/material';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';

//const
const Empty = 0, Green = 1, Yellow = 2, Gray = 3;
const keys = [['Q','W','E','R','T','Y', 'U', 'I', 'O', 'P'],['A','S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],['Z', 'X', 'C', 'V', 'B', 'N', 'M']]
const answers = ["HELLO", "ADULT", "CHEST", "CRIME", "DRAFT", "ENTRY", "FOCUS", "FRAME", "HOTEL", "INDEX", "JUDGE", "MAJOR", "MARCH", "OFFER", 
"FERRY", "PILOT", "PIVOT", "POINT", "PEACH", "PRIDE", "SCALE", "THING", "UNITY", "TRIAL", "WHITE", "WHEAT", "WHERE", "METAL", "FORCE", "ERROR", 
"QUEEN", "SUPER", "SHARE", "REACT", "LOYAL", "OCCUR", "OLDER", "WATCH", "ADMIT", "AUDIO", "AWARE", "APART", "AHEAD", "ABOVE", "BAKER", "BEING", 
"BRIEF", "BLAME", "BOUND", "BIRTH", "CABLE", "CIVIL", "COAST", "CRASH", "CYCLE", "COURT", "CLOSE", "DEATH", "DOUBT", "DOZEN", "DYING", "DRINK",
"DRINK", "DEPTH", "EQUAL", "EVENT", "EXACT", "EIGHT", "EXIST", "EARLY", "FAITH", "FLUID", "FRAUD", "FUNNY", "FINAL", "GROUP", "GUEST", "HEAVY", 
"HORSE", "IMAGE", "INPUT", "JOINT", "LARGE", "LEAVE", "LOGIC", "LUCKY", "MIGHT", "MOUTH", "MOVIE", "MAGIC", "NURSE", "NOISE", "OCEAN", "PAPER",
"PHASE", "PRINT", "PIECE", "PLANT", "PHOTO", "POWER", "RATIO", "ROUTE", "ROYAL", "SCOPE", "SHARP", "SHOCK", "SIXTH", "SOLID", "SORRY", "SOLVE",
"STUDY", "SUGER", "STONE", "THROW", "THANL", "TIMES", "TOUCH", "TRADE", "TREND", "TRUST", "TITLE", "UPSET", "VISIT", "VALUE", "WOMAN", "WORSE"]
const compliments = ["genius", "magnificent", "impressive", "splendid", "great", "phew"];
const App= ()=> {

  const [result, ssetresult] = useState(JSON.parse(localStorage.getItem('result')) || [0,0,0,0,0,0]);
  const [played, ssetplayed] = useState(parseInt(JSON.parse(localStorage.getItem('played')))|| 0 )
  const [streak, ssetstreak] = useState(parseInt(JSON.parse(localStorage.getItem('streak'))) || 0 )
  const [maxstreak, ssetmaxstreak] = useState(parseInt(JSON.parse(localStorage.getItem('maxstreak'))) || 0)
  const [lastwin, ssetlastwin] = useState(parseInt(JSON.parse(localStorage.getItem("lastwin"))) || -1)

  const resultr = useRef(result)
  const playedr = useRef(played)
  const streakr = useRef(streak)
  const maxstreakr = useRef(maxstreak)
  const lastwinr = useRef(lastwin)

  const setresult = (a)=>{
    resultr.current = a;
    ssetresult(a);
  }

  const setplayed = (a)=>{
    playedr.current = a;
    ssetplayed(a);
  }
  const setstreak = (a)=>{
    streakr.current = a;
    ssetstreak(a);
  }
  const setmaxstreak = (a)=>{
    maxstreakr.current = a;
    ssetmaxstreak(a);
  }
  const setlastwin = (a)=>{
    lastwinr.current = a;
    ssetlastwin(a);
  }



  useEffect(() => {
    localStorage.setItem('result', JSON.stringify(result))
    // console.log("update to ", result)
  }, [result])

  useEffect(() => {
    localStorage.setItem('played', JSON.stringify(played))
  }, [played])

  useEffect(() => {
    localStorage.setItem('streak', JSON.stringify(streak))
  }, [streak])

  useEffect(() => {
    localStorage.setItem('maxstreak', JSON.stringify(maxstreak))
  }, [maxstreak])

  useEffect(() => {
    localStorage.setItem('lastwin', JSON.stringify(lastwin))
  }, [lastwin])



  const [grid, setgrid] = useState([[]]);
  const [init, setinit] = useState(0);
  const [keystate, ssetkeystate] = useState([[],[],[]]);
  const [ans, ssetans] = useState("");
  const [cur, setcur] = useState([0,-1]);
  const [clickable, ssetclickable] = useState(true);
  const [compliment, setcompliment] = useState(compliments[0]);
  const [snackopen, setsnackopen] = useState(false);
  const gridref = useRef(grid);
  const curref = useRef(cur);
  const ansref = useRef(ans);
  const keystateref = useRef(keystate);
  const clickableref = useRef(clickable);
  const [time, settime] = useState(2000);
  const [statusopen, setstatusopen] = useState(false);
  const [copytext, ssetcopytext] = useState("");

  const copytextr = useRef(copytext)

  const setcopytext = (a)=>{
    copytextr.current = a;
    ssetcopytext(a);
  }



  const updategrid = (newgrid)=>{
    setgrid(newgrid)
    gridref.current = newgrid;
  }

  const setclickable = (c)=>{
    ssetclickable(c)
    clickableref.current = c;
  }

  const win = (c)=>{
    let newtext = `Wordle(prac) ${curref.current[0]+1}/6\n\n`;
    for (let i = 0; i < curref.current[0]+1; i++) {
      for (let j = 0; j < 5; j++) {
        let n = gridref.current[i][j]
        newtext = newtext.concat((n.state==Green)? "🟩": (n.state==Yellow)? "🟨": "⬛")
      }
      newtext = newtext.concat("\n");
    }
    newtext = newtext.concat(`\nAnswer: ${ansref.current}`)
    setcopytext(newtext)
    // console.log(newtext)
    if(streakr.current+1>maxstreakr.current) setmaxstreak(streakr.current+1)
    setstreak(streakr.current+1);
    let ans = [...resultr.current];
    // console.log("before win: ", resultr.current)
    ans[curref.current[0]]++
    setresult(ans)
    setlastwin(curref.current[0])
    setplayed(playedr.current+1);
    settime(2000)
    setcompliment(compliments[c]);
    setclickable(false);
    setsnackopen(true);
  }

  const lose = ()=>{
    setstreak(0);
    setplayed(playedr.current+1);
    setlastwin(-1)
    settime(2000)
    setcompliment(ansref.current);
    setclickable(false);
    setsnackopen(true);
  }

  const updatecur = (newcur)=>{
    setcur(newcur)
    curref.current = newcur;
  }

  const setans = (anss)=>{
    ssetans(anss)
    ansref.current = anss;
  }

  const setkeystate = (s)=>{
    ssetkeystate(s)
    keystateref.current = s;
  }

  const initialize = ()=>{
    setcopytext("");
    //initialize
    let temp = [];
    for (let i = 0; i < 6; i++) {
      temp.push([])
      for (let j = 0; j < 5; j++) {
        temp[i].push({letter: "",state: Empty})
      }
    }
    updategrid(temp);
    let anss = answers[Math.floor(Math.random() * answers.length)];
    setans(anss);
    temp = [];
    for (let i = 0; i < 3; i++) {
      temp.push([]);
      for (const nn of keys[i]) {
        temp[i].push({letter: nn,state: Empty})
      }
    }
    setkeystate(temp);
    setclickable(true)
    updatecur([0,-1])
  }

  useEffect(() => {
    if(init == 0){
        initialize()
        setinit(1);
    }
  }, [init])

  const keyPress = e=>{
    // console.log(e.key)
    if(e.key == "Backspace"){
      deleteclick()
    }else if(e.key == "Enter"){
      enterclick()
    }else if(e.key.length ==1 && e.key.match(/[a-z]/i)){
      let key = e.key.toUpperCase();
      keyclick(key);
    }
    // console.log(e.key.toLowerCase(), e.key.toUpperCase());
  }

  useEffect(() => {
    window.addEventListener("keydown", keyPress);
    return () => {
      window.removeEventListener("keydown", keyPress);
    };
  }, []);

  // useEffect(()=>{
  //   console.log(ans)
  // }, [ans])


  const handleClose = () => {
    setsnackopen(false);
    if(time==2000){
      setstatusopen(true)
    }
  };

  const statusClose = () => {
    setstatusopen(false);
  };

  const keyclick = (key)=>{
    let tempgrid = [...gridref.current];
    if(clickableref.current && curref.current[0]<6 && curref.current[1]+1<5){
      tempgrid[curref.current[0]][curref.current[1]+1].letter = key;
      updategrid(tempgrid);
      updatecur([curref.current[0], curref.current[1]+1]);
    }
  }


  const deleteclick = ()=>{
    let tempgrid = [...gridref.current];
    if(clickableref.current && curref.current[0]<6 && curref.current[1]+1>0){
      tempgrid[curref.current[0]][curref.current[1]].letter = "";
      updategrid(tempgrid);
      updatecur([curref.current[0], curref.current[1]-1]);
    }
  }

  const enterclick = ()=>{
    let tempgrid = [...gridref.current];
    let tempkeystate = [...keystateref.current]
    let myrepeat = [0,0,0,0,0];
    let ansrepeat = [0,0,0,0,0];
    let greens = 0;
    let word = "";
    for(let i = 0;i<5; i++){
      word = word.concat(tempgrid[curref.current[0]][i].letter.toLowerCase());
    }
    //check if word exist
    axios.get(`https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=true&includeTags=false&api_key=${process.env.REACT_APP_APIKEY}`)
    .then(res => {
      for(let i = 0; i < 5; i++){
        for(let j = i + 1; j < 5; j++){
          if(tempgrid[curref.current[0]][i].letter== tempgrid[curref.current[0]][j].letter){
            myrepeat[i]++;
          }
          if(ansref.current[i] == ansref.current[j]){
            ansrepeat[i]++;
          }
        }
      }
      if(clickableref.current && curref.current[0]<6 && curref.current[1]==4){
        //check if correct
        for (let i = 0; i < 5; i++) {
          if(tempgrid[curref.current[0]][i].letter==ansref.current[i]){
            ansrepeat[i] = -1
            //to green
            greens++;
            tempgrid[curref.current[0]][i].state = Green;
            let done = false;
            for (let w = 0; w < 3; w++) {
              if(done) break;
              for (const n of tempkeystate[w]) {
                if(n.letter==tempgrid[curref.current[0]][i].letter){
                  done = true;
                  n.state = Green;
                  break;
                }
              }
            }
          }else{
            let isyellow = false;
            for(let j = 0; j < 5; j++){
              if(tempgrid[curref.current[0]][i].letter==ansref.current[j] && myrepeat[i]<= ansrepeat[j]){
                //to yellow
                let done = false;
                isyellow = true;
                tempgrid[curref.current[0]][i].state = Yellow;
                for (let w = 0; w < 3; w++) {
                  if(done) break;
                  for (const n of tempkeystate[w]) {
                    if(n.letter==tempgrid[curref.current[0]][i].letter){
                      if(n.state != Green){
                        n.state = Yellow;
                      }
                      break;
                    }
                  }
                }
              }
            }
            if(!isyellow){
              //to gray
              tempgrid[curref.current[0]][i].state = Gray;
              let done = false;
                for (let w = 0; w < 3; w++) {
                  if(done) break;
                  for (const n of tempkeystate[w]) {
                    if(n.letter==tempgrid[curref.current[0]][i].letter){
                      done = true;
                      if(n.state != Green){
                        n.state = Gray;
                      }
                      break;
                    }
                  }
                }
            }
          }
  
        }
        updategrid(tempgrid);
        setkeystate(tempkeystate);
        if(greens==5){
          win(curref.current[0])
        }else if(curref.current[0]>4){
          lose()
        }
        updatecur([curref.current[0]+1, -1]);
      }
    }).catch(err=>{
      settime(1000)
      setcompliment("Not in the word list");
      setsnackopen(true);
    })
  }


  return (
    <div className="wordle">
          <Dialog onClose={statusClose} open={statusopen}> 
          <DialogContent className="status" >
            <div className='statuscancel' onClick={()=>setstatusopen(false)} ><ClearIcon /></div>
            <p className='statustitle' >STATISTICS</p>
            <div className='statuscount'>
            <div className='statusitem'>
              <p className='statusnum'>{played}</p>
              <p className='statusname'>Played</p>
            </div>
            <div className='statusitem'>
              <p className='statusnum'>{(played==0) ? 0:Math.floor((result[0]+result[1]+result[2]+result[3]+result[4]+result[5])/played*100)}</p>
              <p className='statusname'>win %</p>
            </div>
            <div className='statusitem'>
              <p className='statusnum'>{streak}</p>
              <p className='statusname'>Current Streak</p>
            </div>
            <div className='statusitem'>
              <p className='statusnum'>{maxstreak}</p>
              <p className='statusname'>Max Streak</p>
            </div>
            </div>
            <p style={{marginTop:"15px"}} className='statustitle' >GUESS DISTRUBUTION</p>
            <div style={{marginLeft:"40px"}}>
              <div className='guesscount' >
                <p className='guessA'>1</p>
                <p className='guessB' style={{backgroundColor:(lastwin==0)? "#538d4e":"#3a3a3c", width:`${(Math.max(...result)==0)? "15px": (330/Math.max(...result)*result[0])+15}px`}}>{result[0]}</p>
              </div>
              <div className='guesscount' >
                <p className='guessA'>2</p>
                <p className='guessB' style={{backgroundColor:(lastwin==1)? "#538d4e":"#3a3a3c", width:`${(Math.max(...result)==0)? "15px":(330/Math.max(...result)*result[1])+15}px`}}>{result[1]}</p>
              </div>
              <div className='guesscount' >
                <p className='guessA'>3</p>
                <p className='guessB' style={{backgroundColor:(lastwin==2)? "#538d4e":"#3a3a3c", width:`${(Math.max(...result)==0)? "15px":(330/Math.max(...result)*result[2])+15}px`}}>{result[2]}</p>
              </div>
              <div className='guesscount' >
                <p className='guessA'>4</p>
                <p className='guessB' style={{backgroundColor:(lastwin==3)? "#538d4e":"#3a3a3c", width:`${(Math.max(...result)==0)? "15px":(330/Math.max(...result)*result[3])+15}px`}}>{result[3]}</p>
              </div>
              <div className='guesscount' >
                <p className='guessA'>5</p>
                <p className='guessB' style={{backgroundColor:(lastwin==4)? "#538d4e":"#3a3a3c", width:`${(Math.max(...result)==0)? "15px":(330/Math.max(...result)*result[4])+15}px`}}>{result[4]}</p>
              </div>
              <div className='guesscount' >
                <p className='guessA'>6</p>
                <p className='guessB' style={{backgroundColor:(lastwin==5)? "#538d4e":"#3a3a3c", width:`${(Math.max(...result)==0)? "15px":(330/Math.max(...result)*result[5])+15}px`}}>{result[5]}</p>
              </div>
            </div>
            <div className='statusbuttons' >
              <Button onClick={(n)=>{
                initialize()
                n.target.blur()
                setstatusopen(false)
              }} variant="contained" color="secondary" size="large" >play again</Button>
              <CopyToClipboard text={copytext}>
              <Button onClick={(n)=>{
                settime(1500)
                setcompliment("Copied to clipboard");
                setsnackopen(true);
              }} variant="contained" size="large" endIcon={<ShareIcon />} >share</Button>
              </CopyToClipboard>
            </div>

          </DialogContent>
          </Dialog> 
         <Snackbar open={snackopen}
          autoHideDuration={time}
          transitionDuration={{ appear: 100, exit: 500 }}
          anchorOrigin={{ vertical: "top", horizontal: "center"}}
          TransitionComponent={Fade}
          onClose={handleClose}
          onClick={()=>{}}
        >
          <SnackbarContent style={{
            backgroundColor:'white',
            color: "#3A3A3C",
          }}
            message={compliment}
          />
        </Snackbar>
        <div>
        <div className="bar">
          <div className='restart'>
            <Button onClick={(n)=>{
              initialize()
              n.target.blur()
            }} variant="contained" size="medium" >AGAIN</Button>
          </div>
          <div className="title">
            <div className="title1">WORDLE</div>
            <div className="title2">PRAC</div>
          </div>
          <Rank click={()=>setstatusopen(true)} />
        </div>
        <div className="line"></div>
        </div>
        <div className='words'>
          {grid.map( (n,i) => 
            <div key={i} className='cellRow'>
            {n.map((nn, j)=><div key={j} style={{borderColor: (i==cur[0] && j == cur[1])? "#565758":"#3a3a3c" }}  className={(nn.state==Empty)? "Empty": ((nn.state==Gray)? "Gray": ((nn.state==Yellow)? "Yellow": "Green"))} >{nn.letter}</div>
            )}
            </div>
          )}
        </div>
        <div className='keyboard'>
            <div className='keyRow'>
              {keystate[0].map((n,i)=><div key={i} onClick={e=> keyclick(e.target.innerHTML)} className={(n.state==Empty)? "Emptykey": ((n.state==Gray)? "Graykey": ((n.state==Yellow)? "Yellowkey": "Greenkey"))}>{n.letter}</div>)} 
            </div>
            <div className='keyRow2'>
              {keystate[1].map((n,i)=><div key={i} onClick={e=> keyclick(e.target.innerHTML)} className={(n.state==Empty)? "Emptykey": ((n.state==Gray)? "Graykey": ((n.state==Yellow)? "Yellowkey": "Greenkey"))}>{n.letter}</div>)} 
            </div>
            <div className='keyRow'>
              <div onClick={e=>enterclick()} className='Enterkey'>ENTER</div>
              {keystate[2].map((n,i)=><div key={i} onClick={e=> keyclick(e.target.innerHTML)} className={(n.state==Empty)? "Emptykey": ((n.state==Gray)? "Graykey": ((n.state==Yellow)? "Yellowkey": "Greenkey"))}>{n.letter}</div>)} 
              <div onClick={e=> deleteclick()} className='Deletekey'><img className='deleteimg' src={keyclear} /></div>
            </div>
            
        </div>
    </div>
  );
}

export default App;
