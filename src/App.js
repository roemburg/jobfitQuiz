import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import quizAnswers from './api/quizAnswers';
import quizQuestions from "./api/quizQuestions";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import logo from "./svg/logo.svg";
import "./App.css";

let checkExist;
const history = createBrowserHistory();
const trackingId = "GTM-K968CFQ";
ReactGA.initialize(trackingId);
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      questionId: 1,
      question: "",
      answerOptions: [],
      answer: "",
      answersCount: {},
      result: "",
      rslt: 0,
      welcome: true
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
  }

  componentDidMount() {
    this.setState({
      question: quizQuestions[0].question,
      answerOptions: quizAnswers
    });
  }

  addform = id => {
    const script = document.createElement("script");
    script.src = "https://thejobfitters.activehosted.com/f/embed.php?id=" + id;
    console.log(script.src);
    script.async = true;
    document.body.appendChild(script);
  };

  shuffleArray(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    if (this.state.questionId < quizQuestions.length) {
      setTimeout(() => this.setNextQuestion(), 300);
    } else {
      setTimeout(() => this.setResults(this.getResults()), 300);
    }
  }

  setUserAnswer(answer) {
    this.setState((state, props) => ({
      answersCount: {
        ...state.answersCount,
        [answer]: (state.answersCount[answer] || 0) + 1
      },
      answer: answer
    }));
    this.setState({ rslt: Number(this.state.rslt) + Number(answer) });
    // console.log(this.state.rslt);
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;

    this.setState({
      counter: counter,
      questionId: questionId,
      question: quizQuestions[counter].question,
      answerOptions: quizAnswers,
      answer: ""
    });
  }

  getResults() {
    return this.state.rslt;
  }

  setResults(result) {
    console.log("LAK" + result);
    this.setState({ result: result });
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  formScore = score => {
    let testScore;
    if (
      document.getElementsByTagName("form") &&
      document.querySelector('[data-name="testscore"]')
    ) {
      testScore = document.querySelector(
        '[data-name="testscore"]'
      ).value = score;
      console.log("Form exists, set hidden field testscore: " + testScore);
      clearInterval(checkExist);
    }
  };

  renderResult(score) {
    let formId;

    score -= 5; // minus N questions for 5x 0 score bug and starting lowest anwsers value at 1 

    checkExist = setInterval(() => {	
      this.formScore(score);	
    }, 100); // check every 100ms if ActiveCampaign form has rendered before setting hidden testscore field
    
    if (score <= 5) {
      formId = 5;
    } else if (score <= 10) {
      formId = 7;
    } else if (score <= 15) {
      formId = 9;
    } else {
      formId = 11;
    }

    console.log('SCORE: ' + score);
    console.log('FORM ID: ' + formId);
    this.addform(formId);
    return  (<div className={"outro _form_"+formId} />);
  }

  renderWelcome = () => {
    return (
      <div className='App-header intro'>
        <div className='container'>
          <h1>Hoeveel voldoening haal jij uit je werk?</h1>

          <h2>
            Met deze test ontdek jij of jouw job eigenlijk wel bij je past.​
          </h2>

          <h3>
            Na het geven van jouw jobfit score krijg je ook advies over wat je
            kan doen om meer voldoening uit je werk te halen!
          </h3>

          <button onClick={() => this.setState({ welcome: false })}>
            DOE JOBFIT TEST
          </button>
        </div>
      </div>
    );
  };

  render() {
    console.log(this.state.rslt);
    return (
      <div className="App">
        <div className="App-header bg-white">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        {this.state.welcome && this.renderWelcome()}
        {this.state.result &&
          !this.state.welcome &&
          this.renderResult(this.state.result)}
        {!this.state.result && !this.state.welcome && this.renderQuiz()}
      </div>
    );
  }
}

export default App;
