function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          NOXSHIFT™
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          The Ultimate Employee Scheduler
        </p>
        <a 
          href="/login"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            background: 'linear-gradient(to right, #7c3aed, #2563eb)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.75rem',
            fontWeight: '600',
            fontSize: '1.125rem'
          }}
        >
          Get Started
        </a>
      </div>
    </div>
  )
}

export default App

