const showHide = (id) => {
  document.getElementById(id).classList.toggle('hide');
};

const secrets = (function () {
  keys = {
    alice: {
      private: null,
      public: null,
      bobpublic: null,
      sharedsecret: null,
      sharedsecret: null,
    },
    bob: {
      private: null,
      public: null,
      sharedsecret: null,
      alicepublic: null,
    },
  };

  return {
    alice: {
      setPrivate: (k) => (keys.alice.private = k),
      setPublic: (k) => (keys.alice.public = k),
      getPrivate: () => keys.alice.private,
      getPublic: () => keys.alice.public,
      getBobPublic: () => keys.alice.bobpublic,
      setBobPublic: (k) => (keys.alice.bobpublic = k),
      getSharedSecret: () => keys.alice.sharedSecret,
      setSharedSecret: (k) => (keys.alice.sharedSecret = k),
    },
    bob: {
      setPrivate: (k) => (keys.bob.private = k),
      setPublic: (k) => (keys.bob.public = k),
      getPrivate: () => keys.bob.private,
      getPublic: () => keys.bob.public,
      getAlicePublic: () => keys.bob.alicepublic,
      setAlicePublic: (k) => (keys.bob.alicepublic = k),
      getSharedSecret: () => keys.bob.sharedSecret,
      setSharedSecret: (k) => (keys.bob.sharedSecret = k),
    },
  };
})();

var g = BigInt('0x' + '2');
const n_string =
  'ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff';

const n = BigInt('0x' + n_string);

let modPow = function (base, exp, mod) {
  var ans = BigInt(1);
  while (exp) {
    if (exp % BigInt(2)) ans = (ans * base) % mod;
    base = (base * base) % mod;
    exp = exp / BigInt(2);
  }
  return ans;
};
const getRandomChars = function (length) {
  // var randomChars = '0123456789abcdef';
  // var result = '';
  // for (var i = 0; i < length; i++) {
  //   result += randomChars[Math.floor(Math.random() * randomChars.length)];
  // }
  // return result;
  let k = crypto.getRandomValues(new Uint8Array(length / 2));
  k = [...new Uint8Array(k)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return k;
};

const generateAliceSecret = () => {
  let k = getRandomChars(768);

  secrets.alice.setPrivate('0x' + k);
  document.getElementById('main-container').classList.value = 'step-2';
  document.getElementById('alicesecret').innerText = k;
  document.body.scrollIntoView({ block: 'end', behavior: 'smooth' });
};
const generateBobSecret = () => {
  let k = getRandomChars(768);
  secrets.bob.setPrivate('0x' + k);
  document.getElementById('main-container').classList.value = 'step-3';
  document.getElementById('bobsecret').innerText = k;
  document.body.scrollIntoView({ block: 'end', behavior: 'smooth' });
};
const calcAlicePublic = () => {
  let k = modPow(g, BigInt(secrets.alice.getPrivate()), n).toString(16);
  secrets.alice.setPublic('0x' + k);
  document.getElementById('main-container').classList.value = 'step-4';
  document.getElementById('alicepublic').innerText = k;
  document.body.scrollIntoView({ block: 'end', behavior: 'smooth' });
};
const calcBobPublic = () => {
  let k = modPow(g, BigInt(secrets.bob.getPrivate()), n).toString(16);
  secrets.bob.setPublic('0x' + k);
  document.getElementById('main-container').classList.value = 'step-5';
  document.getElementById('bobpublic').innerText = k;
  document.body.scrollIntoView({ block: 'end', behavior: 'smooth' });
};

const exchangeKeys = () => {
  secrets.alice.setBobPublic(secrets.bob.getPublic());
  secrets.bob.setAlicePublic(secrets.alice.getPublic());
  document.getElementById('main-container').classList.value = 'step-6';
  document.body.scrollIntoView({ block: 'end', behavior: 'smooth' });
};

const aliceComputeSharedSecret = () => {
  let k = modPow(
    BigInt(secrets.alice.getBobPublic()),
    BigInt(secrets.alice.getPrivate()),
    n
  ).toString(16);
  secrets.alice.setSharedSecret('0x' + k);
  document.getElementById('main-container').classList.value = 'step-7';
  document.getElementById('alicesharedsecret').innerText = k;
  document.body.scrollIntoView({ block: 'end', behavior: 'smooth' });
};

const bobComputeSharedSecret = () => {
  let k = modPow(
    BigInt(secrets.bob.getAlicePublic()),
    BigInt(secrets.bob.getPrivate()),
    n
  ).toString(16);
  secrets.bob.setSharedSecret('0x' + k);
  document.getElementById('main-container').classList.value = 'step-8';
  document.getElementById('bobsharedsecret').innerText = k;
  document.body.scrollIntoView({ block: 'end', behavior: 'smooth' });
};

const compareSharedSecret = () => {
  if (secrets.alice.getSharedSecret() === secrets.bob.getSharedSecret()) {
    document.getElementById('result').innerHTML =
      '<span class="green">Congratulations! You just established the same shared secret over a public network.</span>';
    document.getElementById('alicesharedsecret').style.backgroundColor =
      'lightgreen';
    document.getElementById('bobsharedsecret').style.backgroundColor =
      'lightgreen';
  } else
    document.getElementById('result').innerHTML =
      '<span class="red">Different secrets received. Someone might have tampered with secrets.</span>';

  document.getElementById('main-container').classList.value = 'step-9 finished';
};
