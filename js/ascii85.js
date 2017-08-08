String.prototype.toAscii85 = function() {
  let result = '<~';
  let str = this.toString();
  let arr = [];

  for(let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i).toString(2);
    while(arr[i].length < 8) {
      arr[i] = '0' + arr[i];
    }
  }

  let decimalVal = arr.join('');
  for(let i = 0, j = 1; i < decimalVal.length; i += 32, j++) {
    result += encode(decimalVal.slice(i, j * 32));
  }
   
  return result + '~>';
}

String.prototype.fromAscii85 = function() {
  let result = '';
  let str = this.toString();
  str = str.replace(/\s/g, '');
  str = str.replace(/z/g, '!!!!!');
  str = str.slice(2, str.length - 2);

  for(let i = 0, j = 1; i < str.length; i = i + 5, j++) {
    result += decode(str.slice(i, j * 5));
  }

  return result;
}

function decode (ascii85Str) {
  let padding = 0;
  let decimalVal = 0;
  let decodedValue = '';

  while(ascii85Str.length < 5) {
    ascii85Str += 'u';
    padding++;
  }

  for(let i = ascii85Str.length - 1, j = 0; i >= 0; i--, j++) {
    let asciiVal = ascii85Str.charCodeAt(i) - 33;
    decimalVal += asciiVal * Math.pow(85, j);
  }

  let binaryVal = decimalVal.toString(2);
  while(binaryVal.length < 32) {
    binaryVal = '0' + binaryVal;
  }

  for(let i = 0, l = 1; i < binaryVal.length; i = i + 8, l++) {
    let byte = binaryVal.slice(i, l * 8);
    let decimal = 0;
    for(let j = byte.length - 1, k = 0; j >= 0; j--, k++) {
      decimal += byte[j] * Math.pow(2, k);
    }
    decodedValue += String.fromCharCode(decimal);
  }
  return decodedValue.slice(0, decodedValue.length - padding);
}

function encode (binStr) {
  let padding;

  if((binStr.length / 8) < 4) {
    padding = 4 - (binStr.length / 8);
  } else {
    padding = (binStr.length / 8) % 4;
  }

  for(let i = 0; i < padding; i++) {
    binStr += '00000000';
  }

  if(binStr * 1 === 0 && !padding) {
    return 'z';
  }

  let ascii85String = '';
  let decStr = 0;

  for(let i = binStr.length - 1, j = 0; i >= 0; i--, j++) {
    decStr += binStr[i] * Math.pow(2, j);
  }

  for(let i = 0; i < 5; i++) {
    let ascii85Char = String.fromCharCode(decStr % 85 + 33);
    decStr = Math.floor(decStr / 85);
    ascii85String = ascii85Char + ascii85String;
  }

  return ascii85String.slice(0, ascii85String.length - padding);
}
