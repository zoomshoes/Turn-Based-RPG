// Copy Variable Range by um3k
// v1.0

export const id = "EVENT_UM3K_VARIABLE_COPY_RANGE";

export const name = "Variable: Copy Range";

const alphaRX = /\D/;
const numRX = /\d+/;

const updateVars = (args) => {
	
	var variables = {};
	
	var Ipre = (args.variableI.match(alphaRX) || [""])[0];
	var Inum = Number(args.variableI.match(numRX)[0]);
	var Opre = (args.variableO.match(alphaRX) || [""])[0];
	var Onum = Number(args.variableO.match(numRX)[0]);
	var length = args.range;
	
	var j;
  
	for (let j = 0; j < 512; j++) {
		variables["variable"+j] = j < length ? Ipre + (Inum + j) : j < length*2 ? Opre + (Onum + j-length) : 0;
	}
	variables["variableIlast"] = Ipre + (Inum + length - 1);
	variables["variableOlast"] = Opre + (Onum + length - 1);
	
	return variables;
}

const fields = [].concat(
[
    {
		key: "variableI",
		label: "Source First Variable",
		type: "variable",
		defaultValue: "LAST_VARIABLE",
		postUpdate: (args) => {
			vars = updateVars(args);
			return {
				...args,
				...vars
			};
		} 
    },
    {
      key: "variableO",
      label: "Destination First Variable",
      type: "variable",
      defaultValue: "LAST_VARIABLE",
		postUpdate: (args) => {
			vars = updateVars(args);
			return {
				...args,
				...vars
			};
		} 
    },
    {
      key: "range",
      label: "Range",
      type: "number",
      min: 1,
	  max: 256,
      defaultValue: 2,
		postUpdate: (args) => {
			vars = updateVars(args);
			return {
				...args,
				...vars
			};
		} 
    },
    {
      key: "variableIlast",
      label: "Source Last Variable (reference only)",
      type: "variable",
      defaultValue: "LAST_VARIABLE",
		postUpdate: (args) => {
			vars = updateVars(args);
			return {
				...args,
				...vars
			};
		} 
    },
    {
      key: "variableOlast",
      label: "Destination Last Variable (reference only)",
      type: "variable",
      defaultValue: "LAST_VARIABLE",
		postUpdate: (args) => {
			vars = updateVars(args);
			return {
				...args,
				...vars
			};
		} 
    }
  ] ,
  Array(512)
    .fill()
    .reduce((arr, _, i) => {
      arr.push({
        key: `variable${i}`,
		hide: true,
        type: "variable",
        defaultValue: 0
      });
      return arr;
    }, []),
);

const compile = (input, helpers) => {
  const { variableCopy, variableSetToValue } = helpers;
  const alphaRX = /\D/;
  const numRX = /\d+/;
  
  var Ipre = (input.variableI.match(alphaRX) || [""])[0];
  var Inum = Number(input.variableI.match(numRX)[0]);
  var Opre = (input.variableO.match(alphaRX) || [""])[0];
  var Onum = Number(input.variableO.match(numRX)[0]);
  
  var j;
  
	for (let j = 0; j < input.range; j++) {
		variableCopy(Opre + (Onum + j), Ipre + (Inum + j));
	}
};

module.exports = {
  id,
  name,
  fields,
  compile
};