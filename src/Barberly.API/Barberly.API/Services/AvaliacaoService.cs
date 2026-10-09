using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;

namespace Barberly.API.Services
{
    public class AvaliacaoService : IAvaliacaoService
    {
        private readonly IGeralRepo _geralRepo;
        public AvaliacaoService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<Avaliacao> AtualizarAvaliacaoAsync(int id, Avaliacao avaliacao)
        {
            var avaliacaoAtt = await _geralRepo.PegarPorId<Avaliacao>(id);
            if(avaliacaoAtt == null)
            {
                throw new ArgumentException($"A avaliação não foi encontrada.");
            }

            if (string.IsNullOrWhiteSpace(avaliacao.Comentario)|| avaliacao.Nota == null)
            {
                throw new ArgumentException("O comentário e a nota não podem ser nulos ou vazios.", nameof(avaliacao.Comentario));
            }

            avaliacaoAtt.Nota = avaliacao.Nota;
            avaliacaoAtt.Comentario = avaliacao.Comentario;

            await _geralRepo.Atualizar<Avaliacao>(avaliacaoAtt);
            return avaliacaoAtt;
        }

        public async Task<Avaliacao> CriarAvaliacaoAsync(Avaliacao avaliacao)
        {

            if (string.IsNullOrWhiteSpace(avaliacao.Comentario) || avaliacao.Nota == null || avaliacao.IdAgendamento == null)
            { 
                throw new ArgumentException("O comentário e a nota e o ID do agendamento não podem ser nulos ou vazios.");
            }
            avaliacao.DataAvaliacao = DateTime.Now;

            await _geralRepo.Adicionar<Avaliacao>(avaliacao);
            return avaliacao;
        }

        public async Task<Avaliacao> DeletarAvaliacaoAsync(int id)
        {
            var avaliacao = await _geralRepo.PegarPorId<Avaliacao>(id);
            if (avaliacao == null)
            {
                throw new ArgumentException($"A avaliação não foi encontrada.");
            }
            await _geralRepo.Remover<Avaliacao>(avaliacao);
            return avaliacao;
        }

        public async Task<Avaliacao?> PegarAvaliacaoAsync(int id)
        {
            var avaliacao = await _geralRepo.PegarPorId<Avaliacao>(id);
            if (avaliacao == null)
            {
                throw new ArgumentException($"A avaliação não foi encontrada.");
            }
            return avaliacao;
        }

        public async Task<List<Avaliacao>> PegarAvaliacoesAsync()
        {
            var avaliacoes = await _geralRepo.PegarTodos<Avaliacao>();
            return avaliacoes.ToList();
        }
    }
}
