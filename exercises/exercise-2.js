const solution = (dictionary, template) => {

	const groupsOfWords = Object.keys(dictionary).reduce((groups, key) => {
		const value = dictionary[key];
		if (!groups[value]) {
			groups[value] = [];
		}
		groups[value].push(key);
		return groups;
	}, {});

	const buildWord = (sentence, templateArray) => {
		if (templateArray.length > 0) {
			const key = templateArray[0];
			groupsOfWords[key].forEach(word => {
				buildWord(sentence + (sentence.length > 0 ? ' ' : '') + word, templateArray.slice(1));
			});
		} else {
			result.push(sentence);
		}
	}
	const result = []
	buildWord('', template);
	return result;
}

// Tests

const assertEquals = (message, val1, val2) => {
	if (val1 != val2) console.log('Test error: ' + message);
}

const testSolutions = () => {
	const dictionary = {
		'bottle': 'noun',
		'drink': 'verb',
		'Anne': 'proper noun',
		'break': 'verb',
		'John': 'proper noun'
	}
	const template = ['proper noun', 'verb', 'noun'];
	const expectedResults = ['Anne drink bottle', 'John drink bottle', 'Anne break bottle', 'John break bottle']
	const results =  solution(dictionary, template);
	assertEquals('Solution size', expectedResults.length, results.length);
	expectedResults.forEach((item, index) => {
		assertEquals('Expected result # ' + index, results.includes(item), true);
	});
}

testSolutions();