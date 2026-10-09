using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;

namespace Barberly.API.Services
{
    public class HorarioFuncionamentoService : IHorarioFuncionamentoService
    {
        private readonly IGeralRepo _geralRepo;

        public HorarioFuncionamentoService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<HorarioFuncionamento> CriarHorarioAsync(HorarioFuncionamento horarioFuncionamento)
        {
            if (horarioFuncionamento.IdBarbearia == null || horarioFuncionamento.HoraAbertura == null || horarioFuncionamento.HoraFechamento == null)
            {
                throw new Exception("Horário de funcionamento e Barbearia não encontrado.");
            }

            await _geralRepo.Adicionar<HorarioFuncionamento>(horarioFuncionamento);

            return horarioFuncionamento;
        }

        public async Task<HorarioFuncionamento> PegarHorarioAsync(int id)
        {
            var horarioFuncionamento = await _geralRepo.PegarPorId<HorarioFuncionamento>(id);

            if (horarioFuncionamento == null)
            {
                throw new Exception("Horário de funcionamento não encontrado.");
            }

            return horarioFuncionamento;
        }

        public async Task<HorarioFuncionamento> AtualizarHorarioAsync(int id, HorarioFuncionamento horarioFuncionamento)
        {
            if (horarioFuncionamento == null)
            {
                throw new Exception("Horário de funcionamento não pode ser nulo.");
            }

            var horarioFuncionamentoAtt = await _geralRepo.PegarPorId<HorarioFuncionamento>(id);

            if (horarioFuncionamento.IdBarbearia == null || horarioFuncionamento.HoraAbertura == null || horarioFuncionamento.HoraFechamento == null)
            {
                throw new Exception("Horário de funcionamento e Barbearia não encontrado.");
            }

            horarioFuncionamentoAtt.IdBarbearia = horarioFuncionamento.IdBarbearia;
            horarioFuncionamentoAtt.HoraAbertura = horarioFuncionamento.HoraAbertura;
            horarioFuncionamentoAtt.HoraFechamento = horarioFuncionamento.HoraFechamento;
            horarioFuncionamentoAtt.DiaSemana = horarioFuncionamento.DiaSemana;


            await _geralRepo.Atualizar<HorarioFuncionamento>(horarioFuncionamentoAtt);

            return horarioFuncionamentoAtt;
        }

        public async Task<HorarioFuncionamento> DeletarHorarioAsync(int id)
        {
            var horarioFuncionamento = await _geralRepo.PegarPorId<HorarioFuncionamento>(id);

            if (horarioFuncionamento == null)
            {
                throw new Exception("Horário de funcionamento não encontrado.");
            }

            await _geralRepo.Remover<HorarioFuncionamento>(horarioFuncionamento);

            return horarioFuncionamento;
        }

        public async Task<List<HorarioFuncionamento>> PegarTodosHorariosAsync()
        {
            var horariosFuncionamento = await _geralRepo.PegarTodos<HorarioFuncionamento>();
            return horariosFuncionamento.ToList();
        }
    }
}