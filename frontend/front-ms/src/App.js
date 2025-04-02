import React, { useEffect, useState, useRef } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const emailRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchProducts();
    }
  }, [token]);

  const fetchUsers = () => {
    fetch(`${process.env.REACT_APP_API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error al obtener usuarios", err));
  };

  const fetchProducts = () => {
    fetch(`${process.env.REACT_APP_API_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error al obtener productos", err));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    console.log("Iniciando sesión con:", email, password);

    try {
        console.log("Ruta: ", `${process.env.REACT_APP_API_URL}/users/login`);
        console.log("Body: ", JSON.stringify({ email, password }));
        
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        console.log("Respuesta de la API recibida:", res);

        // Si la respuesta no es OK, muestra el código de error
        if (!res.ok) {
            const errorData = await res.json();
            console.error("Error en la autenticación:", errorData);
            alert("Error: " + errorData.message);
            return;
        }

        const data = await res.json();
        console.log("Datos obtenidos:", data);

        if (data.token) {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            console.log("Token guardado:", data.token);
        } else {
            console.error("No se recibió token en la respuesta");
            alert("Error: No se recibió token.");
        }

    } catch (error) {
        console.error("Error en el login", error);
        alert("Error en la conexión con el servidor.");
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUsers([]);
    setProducts([]);
  };

  return (
    <div>
      <h1>Autenticación con JWT</h1>

      {!token ? (
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Correo" ref={emailRef} required />
          <input type="password" placeholder="Contraseña" ref={passwordRef} required />
          <button type="submit">Iniciar Sesión</button>
        </form>
      ) : (
        <>
          <button onClick={handleLogout}>Cerrar Sesión</button>

          <h2>Usuarios</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>

          <h2>Productos</h2>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                {product.name} - ${product.price}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
