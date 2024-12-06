interface User {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  age: number;
  gender: 'Male' | 'Female';
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  created_at: Date;
  updated_at: Date;
}

interface TokenUser {
  name: string;
  userId: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  age: number;
  gender: 'Male' | 'Female';
}

export const createToken = (user: Partial<User>): TokenUser => {
    return {
      userId: user.id ?? '',        
      name: `${user.firstName} ${user.lastName}`,
      role: user.role ?? 'STUDENT',   
      age: user.age ?? 0,             
      gender: user.gender ?? 'Male',  
    };
  };