"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Home() {

  const {data: session} = authClient.useSession() 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    authClient.signUp.email({
      email,
      password,
      name,
    }, {
      onError: (error: any) => {
        window.alert(error.message);
      },
      onSuccess: () => {
        window.alert("User created successfully");
      }
    });
  };

  const onLogin = () => {
    authClient.signIn.email({
      email,
      password,
    }, {
      onError: (error: any) => {
        window.alert(error.message);
      },
      onSuccess: () => {
        window.alert("User Logged in successfully");
      }
    });
  };

  if (session) {
    return (<div className="flex flex-col items-center justify-center h-screen">
      <p>Logged in {session.user?.name}</p>
      <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Login</p>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={onLogin}>Login</Button>
      </div>
      <div>
      <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={onSubmit}>Create User</Button>
      </div>
    </div>
  )
 
}
