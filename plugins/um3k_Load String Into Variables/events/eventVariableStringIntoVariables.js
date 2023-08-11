// Load String into Variables by um3k
// v1.0

export const id = "EVENT_UM3K_STRING_INTO_VARIABLES";

export const name = "Variable: Load String into Variables";

const alphaRX = /\D/;
const numRX = /\d+/;

const updateVars = (args) => {
	
	var variables = {};
	
	var Ipre = (args.variable.match(alphaRX) || [""])[0];
	var Inum = Number(args.variable.match(numRX)[0]);
	var length = args.autolength ? args.istring.length : args.length;
	
	var j;
	var i;
  
	for (let j = 0; j < 52; j++) {
		variables["variable"+j] = j < length ? Ipre + (Inum + j) : 0;
	}
	variables["lastvariable"] = Ipre + (Inum + length - 1);
	
	return variables;
}

const fields = [].concat(
  [
    {
	  key: "desc",
	  label: "Loads a text string into a sequence of variables. \
\"Destination First Variable\" defines the first variable in the sequence, \
it will use however many variables as there are characters in the string. \
Be careful not to overwrite other variables!"
    },
    {
	  key: "istring",
	  label: "Input String",
	  type: "text",
    postUpdate: (args) => {
		vars = updateVars(args);
      return {
        ...args,
        length: args.autolength ? args.istring.length : args.length,
		istring: args.autolength ?  args.istring : args.istring.substring(0, args.length),
		...vars
      };
	}
    },
    {
      key: "length",
      label: "Length",
      type: "number",
      min: 1,
      max: 52,
      defaultValue: 1,
    postUpdate: (args) => {
		vars = updateVars(args);
      return {
        ...args,
        autolength: 0,
		istring: args.istring.substring(0, args.length),
		...vars
      };
	}
    },
    {
      key: "autolength",
      label: "Automatically set length",
      type: "checkbox",
      defaultValue: 1,
    postUpdate: (args) => {
		vars = updateVars(args);
      return {
        ...args,
        length: args.autolength ? args.istring.length : args.length,
		...vars
      };
	}
    },
    {
      key: "emptyvalue",
      label: "Empty String Value",
      type: "number",
      min: 0,
      max: 255,
      defaultValue: 240
    },
    {
      key: "variable",
      label: "Destination First Variable",
      type: "variable",
      defaultValue: "0",
    postUpdate: (args) => {
		vars = updateVars(args);
		  return {
			...args,
			...vars
		  };
		}
    },
    {
      key: "lastvariable",
      label: "Last Variable (for reference)",
      type: "variable",
	  disable: true,
      defaultValue: "0",
    postUpdate: (args) => {
		vars = updateVars(args);
		  return {
			...args,
			...vars
		  };
		}
    }
  ] ,
  Array(52)
    .fill()
    .reduce((arr, _, i) => {
      arr.push({
        key: `variable${i}`,
		hide: true,
        type: "variable",
        defaultValue: i
      });
      return arr;
    }, []),
);

const compile = (input, helpers) => {
  const { variableCopy, variableSetToValue } = helpers;
  
	var Ipre = (input.variable.match(alphaRX) || [""])[0];
	var Inum = Number(input.variable.match(numRX)[0]);
  
  var j;
  
	for (let j = 0; j < input.length; j++) {
		variableSetToValue(Ipre + (Inum + j), j < input.istring.length ? input.istring.charCodeAt(j)-32 : input.emptyvalue);
	}
};

module.exports = {
  id,
  name,
  fields,
  compile
};