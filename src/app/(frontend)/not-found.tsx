import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="notfound">
      <span className="label">Página não encontrada</span>
      <h1 className="display">Esse compartimento está vazio</h1>
      <p className="lead">A página que você procurou não existe ou a peça saiu da loja.</p>
      <Link href="/categoria/todas" className="btn btn--primary btn--small">
        Ver todas as peças
      </Link>
    </div>
  )
}
