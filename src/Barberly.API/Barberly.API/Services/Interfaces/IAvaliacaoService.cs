using Barberly.API.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface IAvaliacaoService
    {
        public Task<Avaliacao> CriarAvaliacaoAsync(Avaliacao avaliacao);
        public Task<Avaliacao?> PegarAvaliacaoAsync(int id);
        public Task<List<Avaliacao>> PegarAvaliacoesAsync();
        public Task<Avaliacao> DeletarAvaliacaoAsync(int id);
        public Task<Avaliacao> AtualizarAvaliacaoAsync(int id, Avaliacao avaliacao);
    }
}
