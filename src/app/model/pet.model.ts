}

interface Pet {
  name: string;
  breeds?: { primary?: string };
  gender?: string;
  age?: string;
  photos?: { medium?: string }[];
}