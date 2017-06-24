'use strict';

import props from 'resources/props';

module.exports = extension => {
    const matchingLanguages = Object.entries(props.languages)
        .filter(entry => entry[1].includes(extension))
        .map(entry => entry[0]);

    return Prism.languages[matchingLanguages.length > 0 ? matchingLanguages[0] : "clike"];
};
