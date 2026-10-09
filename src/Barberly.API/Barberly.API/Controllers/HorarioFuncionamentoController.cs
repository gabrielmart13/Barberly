using Barberly.API.Domain.DTOs.HorarioFuncionamentoDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HorarioFuncionamentoController : ControllerBase
    {
        private readonly IHorarioFuncionamentoService _horariofuncionamentoService;

        public HorarioFuncionamentoController(
            IHorarioFuncionamentoService horariofuncionamentoService)
        {
            _horariofuncionamentoService = horariofuncionamentoService;
        }

        [HttpGet]
        public async Task<ActionResult<List<HorarioFuncionamento>>> Get()
        {
            var horariosfuncionamento =
                await _horariofuncionamentoService.PegarTodosHorariosAsync();

            return Ok(horariosfuncionamento);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HorarioFuncionamento>> Get(int id)
        {
            var horariofuncionamento =
                await _horariofuncionamentoService.PegarHorarioAsync(id);

            return Ok(horariofuncionamento);
        }

        [HttpPost]
        public async Task<ActionResult<HorarioFuncionamento>> Post(
            CriarHorarioRequest request)
        {
            HorarioFuncionamento horariofuncionamento = new HorarioFuncionamento
            {
                HoraAbertura = request.HoraAbertura,
                HoraFechamento = request.HoraFechamento,
                DiaSemana = request.DiaSemana,
                IdBarbearia = request.IdBarbearia
            };

            await _horariofuncionamentoService.CriarHorarioAsync(
                horariofuncionamento);

            return Ok(horariofuncionamento);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<HorarioFuncionamento>> Put(
            int id,
            AtualizarHorarioRequest request)
        {
            HorarioFuncionamento horariofuncionamento = new HorarioFuncionamento
            {
                HoraAbertura = request.HoraAbertura,
                HoraFechamento = request.HoraFechamento,
                DiaSemana = request.DiaSemana,
                IdBarbearia = request.IdBarbearia
            };

            await _horariofuncionamentoService.AtualizarHorarioAsync(
                id,
                horariofuncionamento);

            return Ok(horariofuncionamento);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            return Ok(
                await _horariofuncionamentoService.DeletarHorarioAsync(id)
            );
        }
    }
}