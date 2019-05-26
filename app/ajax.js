const objectToQueryString = function (a) {
  let prefix; let s; let add; let name; let r20; let output;
  s = [];
  r20 = /%20/g;
  add = function (key, value) {
    // If value is a function, invoke it and return its value
    value = ( typeof value == 'function' ) ? value() : ( value == null ? '' : value );
    s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
  };
  if (a instanceof Array) {
    for (name in a) {
      add(name, a[name]);
    }
  } else {
    for (prefix in a) {
      buildParams(prefix, a[ prefix ], add);
    }
  }
  output = s.join('&').replace(r20, '+');
  return output;
};
function buildParams(prefix, obj, add) {
  let name; let i; let l; let rbracket;
  rbracket = /\[\]$/;
  if (obj instanceof Array) {
    for (i = 0, l = obj.length; i < l; i++) {
      if (rbracket.test(prefix)) {
        add(prefix, obj[i]);
      } else {
        buildParams(prefix + '[' + ( typeof obj[i] === 'object' ? i : '' ) + ']', obj[i], add);
      }
    }
  } else if (typeof obj == 'object') {
    // Serialize object item.
    for (name in obj) {
      buildParams(prefix + '[' + name + ']', obj[ name ], add);
    }
  } else {
    // Serialize scalar item.
    add(prefix, obj);
  }
}

export default function(url, body = null, method = 'GET') {
  const serverUrl = 'http://localhost:7002/rest';
  return new Promise(function(resolve, reject){
    let xhr = new XMLHttpRequest();
    xhr.open(method, serverUrl + url , false);
        
    if( method === 'POST') {         
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
        
    xhr.onreadystatechange = function() {//Вызывает функцию при смене состояния.
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        resolve(JSON.parse(xhr.responseText));// Запрос завершен. Здесь можно обрабатывать результат.
      } else {
        reject({
          status: xhr.status,
          msg: xhr.statusText 
        }); 
      }
    }

    xhr.send(objectToQueryString(body));

  });
}
