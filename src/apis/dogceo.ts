import axios from 'axios';

type Response = {
  message: {} | string[] | string;
  status: 'success' | 'error';
  code?: number;
};

export async function getAllBreeds() {
  const res = await axios.get<Response>('https://dog.ceo/api/breeds/list/all');
  return res.data;
}

export async function getRandomImg() {
  const res = await axios.get<Response>(
    'https://dog.ceo/api/breeds/image/random',
  );
  return res.data;
}

export async function getBreeds(breed: string) {
  const res = await axios.get<Response>(
    `https://dog.ceo/api/breed/${breed}/images`,
  );
  return res.data;
}
