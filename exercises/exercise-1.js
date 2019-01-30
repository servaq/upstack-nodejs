const getRotatedWord = (word, startPos) => {
	return word.substring(startPos) + word.substring(0, startPos);
}

const getGroupedWords = (words) => {
	return words.reduce((groupedWords, word) => {
		if (groupedWords.length > 0) {
			const wordLowerCase = word.toLowerCase();
			let rotatedWord;
			let groupedWordsIndex;
			for (let i = 0; i < word.length; i++) {
				rotatedWord = getRotatedWord(wordLowerCase, i);
				groupedWordsIndex = groupedWords.findIndex(item => item[0].toLowerCase() == rotatedWord);
				if (groupedWordsIndex >= 0) {
					groupedWords[groupedWordsIndex].push(word);
					return groupedWords;
				}
			}
		}
		groupedWords.push([word]);
		return groupedWords;
	}, []);
}

// Tests

const assertEquals = (message, val1, val2) => {
	if (val1 != val2) console.log('Test error: ' + message);
}

const testGetRotatedWord = () => {
	assertEquals('start from zero', getRotatedWord('london', 0), 'london');
	assertEquals('start from middle', getRotatedWord('london', 1), 'ondonl');
	assertEquals('start from end', getRotatedWord('london', 5), 'nlondo');
}

const testGetGroupedWords = () => {
	const input = ['Tokyo', 'London', 'Rome', 'Donlon', 'Kyoto', 'Paris', 'Orem'];
	const output = [
		['Tokyo', 'Kyoto'],
		['London', 'Donlon'],
		['Rome'],
		['Paris'],
		['Orem']
	];
	const result = getGroupedWords(input);
	assertEquals('result outer lenght', output.length, result.length);
	output.forEach((outputItem, outputItemIndex) => {
		assertEquals(`result[${outputItemIndex}] length`, outputItem.length, result[outputItemIndex].length);
		outputItem.forEach((innerOutputItem, innerOutputItemIndex) => {
			assertEquals(`value result[${outputItemIndex}][${innerOutputItemIndex}]`, innerOutputItem, result[outputItemIndex][innerOutputItemIndex]);
		});
	});
}

testGetRotatedWord();
testGetGroupedWords();