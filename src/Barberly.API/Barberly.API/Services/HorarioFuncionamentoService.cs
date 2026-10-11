using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.DTOs.HorarioFuncionamentoDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Exceptions;
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

        public async Task<HorarioFuncionamento> CriarHorarioAsync(CriarHorarioRequest request)
        {
            if (request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException("Horário de funcionamento nulo.");
            }

            if (request.IdBarbearia <= 0)
            {
                throw new Barberly.API.Exceptions.ValidationException("O ID da barbearia deve ser válido.");
            }

            if (request.HoraAbertura < TimeSpan.Zero ||
                request.HoraAbertura >= TimeSpan.FromDays(1) ||
                request.HoraFechamento <= request.HoraAbertura ||
                request.HoraFechamento >= TimeSpan.FromDays(1))
            {
                throw new Barberly.API.Exceptions.ValidationException("Os horários de funcionamento são inválidos.");
            }

            var horariofuncionamento = new HorarioFuncionamento
            {
                DiaSemana = request.DiaSemana,
                HoraAbertura = request.HoraAbertura,
                HoraFechamento = request.HoraFechamento,
                IdBarbearia = request.IdBarbearia
            };

            await _geralRepo.Adicionar<HorarioFuncionamento>(horariofuncionamento);

            return horariofuncionamento;
        }

        public async Task<HorarioFuncionamento> PegarHorarioAsync(int id)
        {
            var horarioFuncionamento = await _geralRepo.PegarPorId<HorarioFuncionamento>(id);

            if (horarioFuncionamento == null)
            {
                throw new NotFoundException("Horário de funcionamento não encontrado.");
            }

            return horarioFuncionamento;
        }

        public async Task<HorarioFuncionamento> AtualizarHorarioAsync(int id, AtualizarHorarioRequest request)
        {
            if (request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException("Horário de funcionamento não pode ser nulo.");
            }

            var horarioFuncionamentoAtt = await _geralRepo.PegarPorId<HorarioFuncionamento>(id);

            if (horarioFuncionamentoAtt == null)
            {
                throw new NotFoundException("Horário de funcionamento não encontrado.");
            }

            if (request.IdBarbearia <= 0)
            {
                throw new Barberly.API.Exceptions.ValidationException("O ID da barbearia deve ser válido.");
            }

            if (request.HoraAbertura < TimeSpan.Zero ||
                request.HoraAbertura >= TimeSpan.FromDays(1) ||
                request.HoraFechamento <= request.HoraAbertura ||
                request.HoraFechamento >= TimeSpan.FromDays(1))
            {
                throw new Barberly.API.Exceptions.ValidationException("Os horários de funcionamento são inválidos.");
            }

            horarioFuncionamentoAtt.IdBarbearia = request.IdBarbearia;
            horarioFuncionamentoAtt.HoraAbertura = request.HoraAbertura;
            horarioFuncionamentoAtt.HoraFechamento = request.HoraFechamento;
            horarioFuncionamentoAtt.DiaSemana = request.DiaSemana;

            await _geralRepo.Atualizar<HorarioFuncionamento>(horarioFuncionamentoAtt);

            return horarioFuncionamentoAtt;
        }

        public async Task<HorarioFuncionamento> DeletarHorarioAsync(int id)
        {
            var horarioFuncionamento = await _geralRepo.PegarPorId<HorarioFuncionamento>(id);

            if (horarioFuncionamento == null)
            {
                throw new NotFoundException("Horário de funcionamento não encontrado.");
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
