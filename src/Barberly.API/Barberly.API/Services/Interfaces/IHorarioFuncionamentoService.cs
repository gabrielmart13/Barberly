using Barberly.API.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface IHorarioFuncionamentoService
    {
        public Task<List<HorarioFuncionamento>> PegarTodosHorariosAsync();
        public Task<HorarioFuncionamento> PegarHorarioAsync(int id);
        public Task<HorarioFuncionamento> CriarHorarioAsync(HorarioFuncionamento horario);
        public Task<HorarioFuncionamento> AtualizarHorarioAsync(int id, HorarioFuncionamento horario);
        public Task<HorarioFuncionamento> DeletarHorarioAsync(int id);

    }
}
