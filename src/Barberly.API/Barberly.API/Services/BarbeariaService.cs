using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;

namespace Barberly.API.Services
{
    public class BarbeariaService : IBarbeariaService
    {
        private readonly IGeralRepo _geralRepo;
        public BarbeariaService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }
        public async Task<Barbearia> CriarBarbeariaAsync(Barbearia barbearia)
        {
            if (string.IsNullOrWhiteSpace(barbearia.Nome) || string.IsNullOrWhiteSpace(barbearia.Endereco) || barbearia.IdDonoBarbearia == null)
            {
                throw new Exception("Nome, Endereco e IdDonoBarbearia são obrigatórios.");

            }
            await _geralRepo.Adicionar<Barbearia>(barbearia);
            return barbearia;
        }
        public async Task<Barbearia?> PegarBarbeariaAsync(int id)
        {
            var barbearia = await _geralRepo.PegarPorId<Barbearia>(id);
            if (barbearia == null)
            {
                throw new Exception($"Barbearia não encontrada.");
            }
            return barbearia;
        }
        public async Task<List<Barbearia>> PegarBarbeariasAsync()
        {
            var barbearias = await _geralRepo.PegarTodos<Barbearia>();
            return barbearias.ToList();
        }
        public async Task<Barbearia> DeletarBarbeariaAsync(int id)
        {
            var barbearia = await _geralRepo.PegarPorId<Barbearia>(id);
            if (barbearia == null)
            {
                throw new KeyNotFoundException($"Barbearia não encontrada.");
            }
            await _geralRepo.Remover<Barbearia>(barbearia);
            return barbearia;
        }
        public async Task<Barbearia> AtualizarBarbeariaAsync(int id, Barbearia barbearia)
        {
            if(barbearia == null)
            {
                throw new Exception("A barbearia não pode ser nula.");
            }

            var barbeariaAtt = await _geralRepo.PegarPorId<Barbearia>(id);
            if (string.IsNullOrWhiteSpace(barbearia.Nome) || string.IsNullOrWhiteSpace(barbearia.Endereco) || barbearia.IdDonoBarbearia == null)
            {
                throw new Exception("Nome, Endereco e IdDonoBarbearia são obrigatórios.");

            }
            // Atualiza os campos da barbearia existente com os valores da nova barbearia
            barbeariaAtt.Nome = barbearia.Nome;
            barbeariaAtt.Endereco = barbearia.Endereco;
            barbeariaAtt.Contato = barbearia.Contato;
            barbeariaAtt.Descricao = barbearia.Descricao;
            barbeariaAtt.IdDonoBarbearia = barbearia.IdDonoBarbearia;

            await _geralRepo.Atualizar<Barbearia>(barbeariaAtt);
            return barbeariaAtt;
        }
    }
}
