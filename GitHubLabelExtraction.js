//==USED TO GET LABELS IF YOU DIDNT HAVE THE ARRAY OF LABELS BELOW 
var labels = [];
[].slice.call(document.querySelectorAll(".label-link"))
.forEach(function(element) {
  labels.push({
    name: element.textContent.trim(),
    // using style.backgroundColor might returns "rgb(...)"
    color: element.getAttribute("style")
      .replace("background-color:", "")
      .replace(/color:.*/,"")
      .trim()
      // github wants hex code only without # or ;
      .replace(/^#/, "")
      .replace(/;$/, "")
      .trim(),
  })
})
console.log(JSON.stringify(labels, null, 2))


//USED TO ADD LABELS FAST WHEN ON THE LABELS PAGE ON GITHUB
var newLabelName = $($('#label-')[0]),
		newLabelColor = $($('.color-editor-input')[0]),
		newLabelBtn = $(".new-label-actions .btn-primary"),
		labels = [
							  {
							    "name": "blocked: need more info",
							    "color": "5319e7"
							  },
							  {
							    "name": "blocked: question",
							    "color": "5319e7"
							  },
							  {
							    "name": "enhancement",
							    "color": "ededed"
							  },
							  {
							    "name": "priority: critical",
							    "color": "e11d21"
							  },
							  {
							    "name": "priority: high",
							    "color": "eb6420"
							  },
							  {
							    "name": "priority: low",
							    "color": "fbca04"
							  },
							  {
							    "name": "priority: medium",
							    "color": "009800"
							  },
							  {
							    "name": "priority: nice to have",
							    "color": "207de5"
							  },
							  {
							    "name": "status: backlog",
							    "color": "c7def8"
							  },
							  {
							    "name": "status: in progress",
							    "color": "d4c5f9"
							  },
							  {
							    "name": "status: in testing",
							    "color": "fad8c7"
							  },
							  {
							    "name": "status: ready",
							    "color": "ededed"
							  },
							  {
							    "name": "status: test accepted",
							    "color": "ededed"
							  },
							  {
							    "name": "status: test ready",
							    "color": "f7c6c7"
							  },
							  {
							    "name": "status: work ready",
							    "color": "bfdadc"
							  },
							  {
							    "name": "type: bug",
							    "color": "fc2929"
							  },
							  {
							    "name": "type: chore",
							    "color": "eb6420"
							  },
							  {
							    "name": "type: feature",
							    "color": "0052cc"
							  },
							  {
							    "name": "type: infrastructure",
							    "color": "fbca04"
							  }
							],
		total = labels.length,
		i = 0,
		addLabel = function($label) {
				newLabelName.val($label.name)
				newLabelColor.val($label.color)
				newLabelBtn.click();
				i++;
				if(i == length) return;
				console.log('doing:' + i)
				setTimeout(function() {
					addLabel(labels[i])
				}, 800)
		}

		addLabel(labels[i]);


