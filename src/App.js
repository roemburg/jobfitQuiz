import React, { Component } from "react";
import quizQuestions from "./api/quizQuestions";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import logo from "./svg/logo.svg";
import "./App.css";

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
      answerOptions: quizQuestions[0].answers
    });
  }

  addform = id => {
    const script = document.createElement("script");
    script.src = "https://thejobfitters.activehosted.com/f/embed.php?id=" + id;
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
      answerOptions: quizQuestions[counter].answers,
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

  renderResult(id) {
    let formId;

    if (id <= 12) {
      formId = 5;
    }

    if (id > 12 && id < 24) {
      formId = 7;
    }

    if (id > 24 && id < 36) {
      formId = 9;
    }
    if (id > 37 && id < 48) {
      formId = 11;
    }

    this.addform(formId);
    return <div className={"_form_" + formId} />;
  }

  renderWelcome = () => {
    return (
      <div className="App-header">
        <div class="container">
          <h1>JobFit Test​</h1>

          <h2>
            The Jobfitters heeft als missie om zoveel mogelijk mensen in
            Nederland te helpen aan een baan waar ze met plezier naartoe gaan!
          </h2>

          <p>
            Met deze quiz willen we jou helpen te reflecteren op jouw huidige
            werksituatie. Wat gaat momenteel goed maar wat zou er ook beter
            kunnen?​
          </p>

          <button onClick={() => this.setState({ welcome: false })}>
            Start Test
          </button>
          <p>
            <small>
              Het duurt een paar minuten om in te vullen. We sturen je daarna
              een persoonlijke mail met tips en inspiratie!
            </small>
          </p>
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
