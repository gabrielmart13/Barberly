using Barberly.API.Domain.DTOs.HorarioFuncionamentoDTO;
using Barberly.API.Domain.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface IHorarioFuncionamentoService
    {
        public Task<List<HorarioFuncionamento>> PegarTodosHorariosAsync();
        public Task<HorarioFuncionamento> PegarHorarioAsync(int id);
        public Task<HorarioFuncionamento> CriarHorarioAsync(CriarHorarioRequest request);
        public Task<HorarioFuncionamento> AtualizarHorarioAsync(int id, AtualizarHorarioRequest request);
        public Task<HorarioFuncionamento> DeletarHorarioAsync(int id);

    }
}
