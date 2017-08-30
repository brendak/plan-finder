import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './scss/App.css';

/* DATA DATA DATA */
const planDataObj = [{
  'Deluxe': {
    headline: 'For the social small business',
    details: {
			'Cost Per Month': 59,
			'Number of Social Profiles': 5,
			'Brand Keywords per Group': 5,
			'Included Users': 1,
			'Additional Users': 59,
			'Included Groups': 1,
			'Audience Size (Fans/Followers)': 'Up to 100,000'
    },
    'TrialLink': ''
  }
}, {
  'Premium': {
    headline: 'A bigger plan for bigger social needs',
    details: {
			'Cost Per Month': 99,
      'Number of Social Profiles': 10,
      'Brand Keywords per Group': 10,
      'Included Users': 1,
      'Additional Users': 99,
      'Included Groups': 3,
      'Audience Size (Fans/Followers)': 'Up to 200,000'
    },
    'TrialLink': ''
  }
}, {
  'Team': {
    headline: 'Collaborate and conquer social media',
    details: {
			'Cost Per Month': 500,
      'Number of Social Profiles': 30,
      'Brand Keywords per Group': 10,
      'Included Users': 3,
      'Additional Users': 125,
      'Included Groups': 20,
      'Audience Size (Fans/Followers)': 'Up to 500,000'
    },
    'TrialLink': ''
  }
}, {
  'Enterprise': {
    headline: 'Maximize your global social reach',
    details: {
			'Cost Per Month': 1500,
      'Number of Social Profiles': 50,
      'Brand Keywords per Group': 20,
      'Included Users': 10,
      'Additional Users': 125,
      'Included Groups': 50,
      'Audience Size (Fans/Followers)': 'Unlimited'
    },
    'TrialLink': ''
  }
}];

/* HELPER FUNCTIONS */
function getRecPlan(name, plans) {
  var planDataObj;
  for (var i = 0; i < plans.length; i++) {
    if (plans[i][name]) {
      planDataObj = plans[i][name];
    }
  }
  return planDataObj;
}

function bePluralized(word, pluralWord) {
  if (word > 1) {
    return pluralWord + 's';
  } else {
    return pluralWord;
  }
}

/* HEADER HEADER HEADER */
const Header = React.createClass({
  render() {
    return (
      <div className="header">
        <h1>
          <a href="">
  			     <img src="http://i.imgur.com/KZ16pbD.png"></img>
  		    </a>
        </h1>
      </div>
    );
  }
});

/* PAGES DISPLAY */
const PlanFinder = React.createClass({
  getInitialState() {
    return {
      planResult: "Deluxe",
      submitted: false
    }
  },
  setRec(name) {
    this.setState({
      planResult: name,
      submitted: true
    });
  },
  render() {
    var recFormPage,
      planRecPage;
    // determines what page to display
    if (this.state.submitted) {
      recFormPage = null;
      planRecPage = <PlanRec planResult={this.state.planResult} plans={planDataObj} />;
    } else {
      recFormPage = <RecForm data={planDataObj} setRec={this.setRec}/>;
      planRecPage = null;
    }
    return (
      <div>
        <Header />
        {recFormPage}
        {planRecPage}
      </div>
    );
  }
});

/* SELECT MENU IN FIRST PAGE FORM */
const Selector = React.createClass({
  getInitialState() {
    return {
      selectedPlan: "Deluxe",
      rank: 0
    }
  },
  planSelected(e) {
    var planResult = $(e.target.children[e.target.selectedIndex]).attr("data-planResult"),
        rank = $(e.target.children[e.target.selectedIndex]).attr("data-rank");
    this.setState({
      selectedPlan: planResult,
      rank: rank
    });
  },
  // to display options in form menus
  render() {
    var options = [],
      currentValues = [],
      name = this.props.name,
      counter = 0;
    this.props.data.forEach(function(option) {
      var planResult = Object.keys(option)[0];
      var plan = option[planResult];
      var valueToAdd = plan.details[name];
      var index = currentValues.indexOf(valueToAdd);
      if (index === -1) {
        options.push(<option value={valueToAdd} data-rank={counter} data-planResult={planResult}>{valueToAdd}</option>);
        currentValues.push(valueToAdd);
      }
      counter++;
    }, this);
    return (
      <div className="col one tablet-full">
        <label>{name}</label>
          <select onChange={this.planSelected}>
            {options}
          </select>
      </div>
    );
  }
});

/* FOR FORM PAGE */
const RecForm = React.createClass({
  getRec() {
    var currentPlan = "Deluxe",
      currentPlanRank = 0;
// since the user might not select a perfect plan match, the form must cycle through
// their selected options and determine the best ranking plan
    for (var key in this.refs) {
      var obj = this.refs[key];
        /* eslint-disable */
      if (parseInt(obj.state.rank) > currentPlanRank) {
        currentPlan = obj.state.selectedPlan;
        currentPlanRank = parseInt(obj.state.rank);
      }
    }
    this.props.setRec(currentPlan);
  },
  render() {
    return (
      <div className="card-body">
        <div className="centered row">
          <h2>Find the best plan that is right for you!</h2>
        </div>
        <div className="form">
          <div className="row">
            <Selector name="Number of Social Profiles" data={this.props.data} />
          </div>
          <div className="row">
            <Selector name="Audience Size (Fans/Followers)" data={this.props.data} />
          </div>
          <div className="row">
            <Selector name="Included Users" data={this.props.data} />
          </div>
        </div>
        <div className="row">
          <input className="centered btn-form" type="submit" onClick={this.getRec} value="Find My Plan" />
        </div>
      </div>
    );
  }
});

/* FOR RECOMMENDATION PAGE */
const PlanRec = React.createClass({
// function for the trial button link
  getTrial() {
    var data = getRecPlan(this.props.planResult, this.props.plans);
    window.open(data.TrialLink, '_blank');
  },
// function for the compare button link
  comparePlans() {
    window.open('http://www.com', '_blank');
  },
// passing data for use
  render() {
    var planDataObj = getRecPlan(this.props.planResult, this.props.plans);
    var userPlural = bePluralized(planDataObj.details["Included Users"], "User"),
        profilePlural = bePluralized(planDataObj.details["Number of Social Profiles"], "Profile"),
        groupPlural = bePluralized(planDataObj.details["Included Groups"], "Group");
    return (
      <div className="plan">
        <div className="plan-header">
          <div className="row">
            <h3>The right plan for you is...</h3>
						<h1>{this.props.planResult}</h1>
            <h2>{planDataObj.headline}</h2>
          </div>
          <div className="topline"></div>
        </div>
        <div className="plan-result">
        <h3>Features:</h3>
          <div className="row marginless">
            <div className="plan-icon">
              <img src="http://i.imgur.com/F1Of6Qq.png" alt=""></img>
            </div>
            <span>{planDataObj.details["Number of Social Profiles"]} Social {profilePlural}</span>
          </div>
          <div className="row marginless">
            <div className="plan-icon">
              <img src="http://i.imgur.com/8esMI1r.png" alt=""></img>
            </div>
            <span>{planDataObj.details["Audience Size (Fans/Followers)"]} Followers</span>
          </div>
          <div className="row marginless">
            <div className="plan-icon">
              <img src="http://i.imgur.com/pKIqWOP.png" alt=""></img>
            </div>
            <span>{planDataObj.details["Included Users"]} Included {userPlural}</span>
          </div>
          <div className="row marginless">
            <div className="plan-icon">
              <img src="http://i.imgur.com/MlkJCWJ.png" alt=""></img>
            </div>
            <span>{planDataObj.details["Brand Keywords per Group"]} Keywords per Group</span>
          </div>
          <div className="row marginless">
            <section>
            <h3>With:</h3>
              <ul>
                <li>{planDataObj.details["Included Groups"]} Included {groupPlural}</li>
                <li>Additional users are ${planDataObj.details["Additional Users"]} per user/month</li>
              </ul>
            </section>
          </div>
          <div className="row marginless">
            <div className="plan-price">
              <h3>${planDataObj.details["Cost Per Month"]} per user / month</h3>
            </div>
          </div>
          <div className="topline"></div>
          <div className="plan-trial">
            <div className="row marginless">
              <h2>Try Your Free 30-Day Trial Today</h2>
            </div>
            <div className="row">
              <span>Best-in-class social media management<br/> and engagement software. Change plans <br/>or cancel at any time.</span>
            </div>
          </div>
          <div className="row button-block">
            <input className="centered btn-form" type="button" onClick={this.getTrial} value="Start Your Free Trial" />
            <input className="centered btn-compare" type="button" onClick={this.comparePlans} value="Compare Plans" />
          </div>
        </div>
      </div>
    );
  }
});

/* TO RENDER */
ReactDOM.render(<PlanFinder />, document.getElementById('app'));
