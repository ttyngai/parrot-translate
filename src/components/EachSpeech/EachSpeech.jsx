import './EachSpeech.css';
import speak from '../../utilities/speak';
import * as speechesAPI from '../../utilities/speeches-api';
import * as voice from '../../utilities/speechSettings';
import ReactCountryFlag from 'react-country-flag';

export default function EachSpeech({
  user,
  index,
  eachSpeech,
  speech,
  setSpeech,
  speechNonLoggedIn,
  setSpeechNonLoggedIn,
  languageCodes,
  outputLanguage,
  speechPreFav,
  setSpeechPreFav,
  cancelOperation,
}) {
  // Decode object for it's flagCode
  let inputFlagCode, outputFlagCode, preOutputFlagCode;
  languageCodes.forEach(function (c) {
    if (eachSpeech && c.value == eachSpeech.inputLanguage) {
      inputFlagCode = c.flagCode;
    }
    if (eachSpeech && c.value == eachSpeech.outputLanguage) {
      outputFlagCode = c.flagCode;
    }
    if (c.value == outputLanguage) {
      preOutputFlagCode = c.flagCode;
    }
  });

  // Will say again if the speech is clicked
  function handleSayAgain() {
    cancelOperation();
    const lang = voice.speechSettings(eachSpeech.outputLanguage);
    speak(eachSpeech.outputText, lang);
  }

  // Stars some speeches
  async function handleStarSpeech() {
    const starredSpeech = await speechesAPI.star(eachSpeech);
    // update in fav list
    let speechCopy = [...speech];
    let starredSpeechArray = speechCopy.map(function (s) {
      if (s._id == starredSpeech._id) {
        s.isStarred = !s.isStarred;
      }
      return s;
    });
    setSpeech(starredSpeechArray);
    // also update in main list
    let SpeechPreFavCopy = [...speechPreFav];
    let starredSpeechPreFavArray = SpeechPreFavCopy.map(function (s) {
      if (s._id == starredSpeech._id) {
        s.isStarred = !s.isStarred;
      }
      return s;
    });
    setSpeechPreFav(starredSpeechPreFavArray);
  }

  // Delete speeches if object also in database
  async function handleDeleteSpeech() {
    cancelOperation();
    if (eachSpeech._id) {
      const deletedSpeech = await speechesAPI.deleteSpeech(eachSpeech);
      // Delete in state in favourite
      let speechCopy = [...speech];
      let deletedSpeechArray = [];
      speechCopy.forEach(function (s) {
        if (s._id != deletedSpeech._id) {
          deletedSpeechArray.push(s);
        }
      });
      setSpeech(deletedSpeechArray);
      // Delete in state in main translate
      let speechPreFavCopy = [...speechPreFav];
      let deletedSpeechArrayCopy = [];
      speechPreFavCopy.forEach(function (s) {
        if (s._id != deletedSpeech._id) {
          deletedSpeechArrayCopy.push(s);
        }
      });
      setSpeechPreFav(deletedSpeechArrayCopy);
    } else {
      // Delete state only speeches if no id(not in db)
      let speechCopy = [...speech];
      let removed = speechCopy
        .slice(0, index)
        .concat(speechCopy.slice(index + 1));
      setSpeech(removed);
    }
    // Remove from non logged in list as well
    let speechNonLoggedInCopy = [...speechNonLoggedIn];
    let removedNonLoggedIn = [];
    speechNonLoggedInCopy.forEach(function (s) {
      if (s.sortStamp != eachSpeech.sortStamp) {
        removedNonLoggedIn.push(s);
      }
    });
    setSpeechNonLoggedIn(removedNonLoggedIn);
  }

  // Add speech that wasn't in the database but in state
  async function handleAddSpeech() {
    let speechCopy = [...speech];
    eachSpeech.user = user;
    let speechNonLoggedInCopy = [...speechNonLoggedIn];
    let removeAdded = [];
    //Update speech Non Logged in list
    speechNonLoggedInCopy.forEach(function (s) {
      if (s.sortStamp != eachSpeech.sortStamp) {
        removeAdded.push(s);
      }
    });
    setSpeechNonLoggedIn(removeAdded);
    let speechAdded = await speechesAPI.create(eachSpeech);
    speechCopy[index] = speechAdded;
    setSpeech(speechCopy);
  }

  return eachSpeech ? (
    <div className='eachSpeech'>
      {eachSpeech.inputLanguage ? (
        <span className='deleteButton' onClick={handleDeleteSpeech}>
          ✖
        </span>
      ) : (
        ''
      )}
      {eachSpeech._id ? (
        <span
          className={
            eachSpeech.isStarred ? 'starButton buttonStarred' : 'starButton'
          }
          onClick={handleStarSpeech}
        >
          ★
        </span>
      ) : user && eachSpeech.outputLanguage && !eachSpeech.sample ? (
        <span className='addButton' onClick={handleAddSpeech}>
          Add
        </span>
      ) : (
        ''
      )}

      <div className='speechDate'>
        {typeof eachSpeech.timeCreated == 'string'
          ? new Date(eachSpeech.timeCreated).toLocaleString()
          : eachSpeech.timeCreated.toLocaleString()}
      </div>
      <div onClick={handleSayAgain}>
        <div className='input'>
          <div className='flag'>
            <ReactCountryFlag
              countryCode={inputFlagCode}
              svg
              cdnUrl='https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/'
              style={{
                verticalAlign: 'middle',
                borderRadius: '20px',
                fontSize: '28px',
                boxShadow: 'black 5px 5px 10px 0px',
              }}
            />
          </div>
          &nbsp;&nbsp;
          <div className='textBubble inputTextBubble'>
            {eachSpeech.inputText}
          </div>
        </div>
        <div className='output'>
          {eachSpeech.outputText ? (
            <div className='textBubble outputTextBubble'>
              {eachSpeech.outputText}
            </div>
          ) : (
            <div className='textBubble outputTextBubble outputTextBlink'>
              . . .
            </div>
          )}
          &nbsp;&nbsp;
          <div>
            <ReactCountryFlag
              countryCode={
                eachSpeech.outputText ? outputFlagCode : preOutputFlagCode
              }
              svg
              cdnUrl='https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/'
              style={{
                verticalAlign: 'middle',
                borderRadius: '20px',
                fontSize: '28px',
                boxShadow: 'black 5px 5px 10px 0px',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    ''
  );
}
