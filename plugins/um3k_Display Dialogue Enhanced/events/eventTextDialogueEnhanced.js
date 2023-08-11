// Display Dialogue Enhanced by um3k
// v1.0

const alphaRX = /\D?/;
const numRX = /\d+/;

export const id = "EVENT_UM3K_TEXT_ENHANCED";

export const name = "Text: Display Dialogue Enhanced";

const stringRX = /[#\$](\D?\d{1,3})([-:])?(\D?\d{1,3})?[#\$]/g;
const linesRX = /.+/g;
const newlineRX = /\n/g;

const expandVariables = (match, p1, p2, p3, offset, string) => {
	if (p2 == null || p3 == null) {
		if (match[0] == "$") {
			return "$"+p1+"$";
		} else {
			return "#"+p1+"#";
		}
	}
	var p1pre = (p1.match(alphaRX) || [""])[0];
	var p1num = Number(p1.match(numRX)[0]);
	var out = "";
	if (p2 == "-") {
		var p3pre = (p3.match(alphaRX) || [""])[0];
		var p3num = Number(p3.match(numRX)[0]);
		if (p1num <= p3num) {
			for (let j = p1num; j <= p3num; j++) {
				out += "#"+p1pre+String(j)+"#";
			}
		} else {
			for (let j = p1num; j >= p3num; j--) {
				out += "#"+p1pre+String(j)+"#";
			}
		}
	} else if (p2 == ":") {
		for (let j = 0; j < p3; j++) {
			out += "#"+p1pre+String(p1num+j)+"#";
		}
	}
	return out;
}

const dummyValues = (match, p1, p2, p3, offset, string) => {
	if (p2 == null || p3 == null) {
		if (match[0] == "$") {
			return "511";
		} else {
			return "A";
		}
	}
	var p1pre = (p1.match(alphaRX) || [""])[0];
	var p1num = Number(p1.match(numRX)[0]);
	var out = "";
	if (p2 == "-") {
		var p3pre = (p3.match(alphaRX) || [""])[0];
		var p3num = Number(p3.match(numRX)[0]);
		if (p1num <= p3num) {
			for (let j = p1num; j <= p3num; j++) {
				out += "B";
			}
		} else {
			for (let j = p1num; j >= p3num; j--) {
				out += "B";
			}
		}
	} else if (p2 == ":") {
		for (let j = 0; j < p3; j++) {
			out += "C";
		}
	}
	return out;
}

const doBox = (str, i) => {
	var out = "";
	const rowText = String(str).replace(stringRX, dummyValues);
	const glob = rowText.replace(newlineRX, "");
	out += "b" + (i) + ": " + glob.length;
	const lines = [...rowText.matchAll(linesRX)];
	for (let l = 0; l < lines.length; l++) {
		out += ", l" + l + ": " + lines[l][0].length;
	}
	out += "\n";
	return out;
}
		
const calcStats = (args) => {
	var out = "";
	if (Array.isArray(args.text)) {
		for (let i = 0; i < args.text.length; i++) {
			out += doBox(args.text[i], i);
		}
	} else {
		out += doBox(args.text, 0);
	}
	return out;
}

const fields = [
  {
    key: "text",
    type: "textarea",
    placeholder: "Text...",
    multiple: true,
    defaultValue: "",
    postUpdate: (args) => {
		const out = calcStats(args);
		return {
			...args,
			stats: out
		}
    }
  },
  {
    key: "avatarId",
    type: "sprite",
    toggleLabel: "Add Avatar",
    label: "Avatar",
    defaultValue: "",
    optional: true,
    filter: sprite => sprite.numFrames === 1
  },
  {
    key: "stats",
    type: "textarea",
	label: "Stats",
    placeholder: "",
    multiple: false,
    defaultValue: "",
    postUpdate: (args) => {
		const out = calcStats(args);
		return {
			...args,
			stats: out
		}
    }
  },
  {
    key: "expand",
    type: "checkbox",
    toggleLabel: "Expand Variables",
    label: "Expand Variables (optional, done automatically on build)",
    defaultValue: false,
	hide: true,
    postUpdate: (args) => {
		var matches;
		if (Array.isArray(args.text)) {
			matches = [];
			for (let i = 0; i < args.text.length; i++) {
				const rowText = args.text[i];
				matches[i] = String(rowText).replace(stringRX, expandVariables);
			}
		} else {
			matches = String(args.text).replace(stringRX, expandVariables);
		}
		return {
			...args,
			text: matches,
			expand: false
		}
    }
  }
];

const compile = (input, helpers) => {
  const {
    textDialogue,
    textSetOpenInstant,
    textSetCloseInstant,
    textRestoreOpenSpeed,
    textRestoreCloseSpeed
  } = helpers;
  if (Array.isArray(input.text)) {
    // Handle multiple blocks of text
    for (let j = 0; j < input.text.length; j++) {
      const rowText = input.text[j].replace(stringRX, expandVariables);

      // Before first box, make close instant
      if (j === 0) {
        textSetCloseInstant();
      }
      // Before last box, restore close speed
      if (j === input.text.length - 1) {
        textRestoreCloseSpeed();
      }

      textDialogue(rowText || " ", input.avatarId);

      // After first box, make open instant
      if (j === 0) {
        textSetOpenInstant();
      }
      // After last box, restore open speed
      if (j === input.text.length - 1) {
        textRestoreOpenSpeed();
      }
    }
  } else {
    textDialogue(input.text.replace(stringRX, expandVariables) || " ", input.avatarId);
  }
};

module.exports = {
  id,
  name,
  fields,
  compile
};