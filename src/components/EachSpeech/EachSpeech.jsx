import './EachSpeech.css';

export default function EachSpeech({ speech, className, length, index }) {
  let nameOfClass = `eachSpeech`;
  if ((className = 'emptySpeech')) {
    nameOfClass = `eachSpeech ${className}`;
  }

  if (length - 1 == index) {
    nameOfClass = `eachSpeech `;
  }

  return <p className={nameOfClass}>{speech}</p>;
}