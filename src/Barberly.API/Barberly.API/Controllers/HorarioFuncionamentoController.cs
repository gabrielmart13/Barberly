using Barberly.API.Domain.DTOs.HorarioFuncionamentoDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
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

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<List<HorarioFuncionamento>>> Get()
        {
            var horariosfuncionamento =
                await _horariofuncionamentoService.PegarTodosHorariosAsync();

            return Ok(horariosfuncionamento);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<HorarioFuncionamento>> Get(int id)
        {
            var horariofuncionamento =
                await _horariofuncionamentoService.PegarHorarioAsync(id);

            return Ok(horariofuncionamento);
        }

        [Authorize(Roles = "DonoBarbearia")]
        [HttpPost]
        public async Task<ActionResult<HorarioFuncionamento>> Post(CriarHorarioRequest request)
        {    
            var horariofuncionamento = await _horariofuncionamentoService.CriarHorarioAsync(request);
            
            return Ok(horariofuncionamento);
        }

        [Authorize(Roles = "DonoBarbearia")]
        [HttpPut("{id}")]
        public async Task<ActionResult<HorarioFuncionamento>> Put(int id,AtualizarHorarioRequest request)
        {

            var horariofuncionamento = await _horariofuncionamentoService.AtualizarHorarioAsync(id, request);

            return Ok(horariofuncionamento);
        }

        [Authorize(Roles = "DonoBarbearia")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            return Ok(
                await _horariofuncionamentoService.DeletarHorarioAsync(id)
            );
        }
    }
}