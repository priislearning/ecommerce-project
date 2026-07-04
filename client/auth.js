document.addEventListener("DOMContentLoaded", async () => {//waits until html has completely loaded before executing the code inside the function
    const registerForm=document.getElementById("register-form");
    const loginForm=document.getElementById("login-form");
    if(registerForm){//only one form will run thereofre we can use one auth.js file for both pages
        registerForm.addEventListener("submit",async (e)=>{
            e.preventDefault();
            const name=document.getElementById("name").value;
            const email=document.getElementById("email").value;
            const password=document.getElementById("password").value;
            try{
                const response=await fetch("/api/auth/register",{//this send post to ur express backend
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },  
                    body:JSON.stringify({name,email,password})//express receive js object converted to json
                });
                const data=await response.json();
                if(!response.ok){
                    throw new Error(data.message);
                }
                alert("User registered successfully. Please log in.");
                window.location.href="/login.html";
            } catch (error) {
                alert(error.message);
            }
        });
    }
    if(loginForm){
        loginForm.addEventListener("submit",async (e)=>{
            e.preventDefault();
            const email=document.getElementById("email").value;
            const password=document.getElementById("password").value;
            try{
                const response=await fetch("/api/auth/login",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({email,password})
                });
                const data=await response.json();
                if(!response.ok){
                    throw new Error(data.message);
                }
                localStorage.setItem("token",data.token);
                alert("Login successful");
                window.location.href="/index.html";
            } catch (error) {
                alert(error.message);
            }
        });
    }
});