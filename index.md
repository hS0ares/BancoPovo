<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Banco do Povo - Seu banco, sua vida</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }

        .header {
            background-color: #003366;
            padding: 1rem;
            color: white;
        }

        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
        }

        .nav-links a {
            color: white;
            text-decoration: none;
            font-weight: 500;
        }

        .hero {
            background: linear-gradient(rgba(0,51,102,0.8), rgba(0,51,102,0.8)), url('/api/placeholder/1200/600');
            height: 500px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
            padding: 1rem;
        }

        .hero-content h1 {
            font-size: 48px;
            margin-bottom: 1rem;
        }

        .hero-content p {
            font-size: 20px;
            margin-bottom: 2rem;
        }

        .cta-button {
            background-color: #FF9900;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            transition: background-color 0.3s;
        }

        .cta-button:hover {
            background-color: #FF8800;
        }

        .features {
            padding: 4rem 1rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .feature-card {
            text-align: center;
            padding: 2rem;
            background-color: #f5f5f5;
            border-radius: 10px;
        }

        .feature-card img {
            width: 64px;
            height: 64px;
            margin-bottom: 1rem;
        }

        .footer {
            background-color: #002244;
            color: white;
            padding: 2rem;
            text-align: center;
        }

        @media (max-width: 768px) {
            .nav {
                flex-direction: column;
                gap: 1rem;
            }

            .hero-content h1 {
                font-size: 36px;
            }

            .features-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">Banco do Povo</div>
            <div class="nav-links">
                <a href="#conta">Conta Digital</a>
                <a href="#cartoes">Cartões</a>
                <a href="#emprestimos">Empréstimos</a>
                <a href="#investimentos">Investimentos</a>
                <a href="#contato">Contato</a>
            </div>
        </nav>
    </header>

    <section class="hero">
        <div class="hero-content">
            <h1>Seu dinheiro em boas mãos</h1>
            <p>Conte com o Banco do Povo para realizar seus sonhos e construir seu futuro financeiro.</p>
            <a href="#abrir-conta" class="cta-button">Abra sua conta</a>
        </div>
    </section>

    <section class="features">
        <h2 style="text-align: center; margin-bottom: 2rem;">Nossos Serviços</h2>
        <div class="features-grid">
            <div class="feature-card">
                <img src="/api/placeholder/64/64" alt="Conta Digital">
                <h3>Conta Digital</h3>
                <p>Conta sem mensalidade e com transferências gratuitas.</p>
            </div>
            <div class="feature-card">
                <img src="/api/placeholder/64/64" alt="Cartão de Crédito">
                <h3>Cartão de Crédito</h3>
                <p>Sem anuidade e com cashback em todas as compras.</p>
            </div>
            <div class="feature-card">
                <img src="/api/placeholder/64/64" alt="Investimentos">
                <h3>Investimentos</h3>
                <p>As melhores opções para fazer seu dinheiro render.</p>
            </div>
            <div class="feature-card">
                <img src="/api/placeholder/64/64" alt="Empréstimos">
                <h3>Empréstimos</h3>
                <p>Taxas competitivas e aprovação rápida.</p>
            </div>
        </div>
    </section>

    <footer class="footer">
        <p>© 2024 Banco do Povo. Todos os direitos reservados.</p>
        <p>Central de Atendimento: 0800 123 4567</p>
    </footer>
</body>
</html>
