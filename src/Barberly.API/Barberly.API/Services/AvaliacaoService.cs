using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.DTOs.AvaliacaoDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Exceptions;
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

        public async Task<Avaliacao> AtualizarAvaliacaoAsync(int id, AtualizarAvaliacaoRequest request)
        {
            if (request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException("A avaliação não pode ser nula.");
            }

            var avaliacaoAtt = await _geralRepo.PegarPorId<Avaliacao>(id);
            if (avaliacaoAtt == null)
            {
                throw new NotFoundException("A avaliação não foi encontrada.");
            }

            if (string.IsNullOrWhiteSpace(request.Comentario) || request.Nota < 1 || request.Nota > 10)
            {
                throw new Barberly.API.Exceptions.ValidationException("O comentário é obrigatório e a nota deve estar entre 1 e 10.");
            }

            avaliacaoAtt.Nota = request.Nota;
            avaliacaoAtt.Comentario = request.Comentario;

            await _geralRepo.Atualizar<Avaliacao>(avaliacaoAtt);
            return avaliacaoAtt;
        }

        public async Task<Avaliacao> CriarAvaliacaoAsync(CriarAvaliacaoRequest request)
        {
            if (request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException("Os dados da avaliação não podem ser nulos.");
            }

            if (string.IsNullOrWhiteSpace(request.Comentario) || request.Nota < 1 || request.Nota > 10 || request.IdUsuario <= 0 || request.IdAgendamento <= 0)
            {
                throw new Barberly.API.Exceptions.ValidationException("O comentário é obrigatório, a nota deve estar entre 1 e 10 e os IDs devem ser válidos.");
            }

            var avaliacao = new Avaliacao
            {
                Nota = request.Nota,
                Comentario = request.Comentario,
                IdUsuario = request.IdUsuario,
                IdAgendamento = request.IdAgendamento,
                DataAvaliacao = DateTime.Now
            };

            await _geralRepo.Adicionar<Avaliacao>(avaliacao);
            return avaliacao;
        }

        public async Task<Avaliacao> DeletarAvaliacaoAsync(int id)
        {
            var avaliacao = await _geralRepo.PegarPorId<Avaliacao>(id);
            if (avaliacao == null)
            {
                throw new NotFoundException("A avaliação não foi encontrada.");
            }
            await _geralRepo.Remover<Avaliacao>(avaliacao);
            return avaliacao;
        }

        public async Task<Avaliacao?> PegarAvaliacaoAsync(int id)
        {
            var avaliacao = await _geralRepo.PegarPorId<Avaliacao>(id);
            if (avaliacao == null)
            {
                throw new NotFoundException("A avaliação não foi encontrada.");
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
