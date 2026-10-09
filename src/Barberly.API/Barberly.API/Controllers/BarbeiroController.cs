using Barberly.API.Data;
using Barberly.API.Domain.DTOs.BarbeiroDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BarbeiroController : ControllerBase
    {
        private readonly IBarbeiroService _barbeiroService;
        public BarbeiroController (IBarbeiroService barbeiroService)
        {
            _barbeiroService = barbeiroService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Barbeiro>>> Get()
        {
            var barbeiros = await _barbeiroService.PegarTodosBarbeirosAsync();
            return Ok(barbeiros);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Barbeiro>> Get(int id)
        {
            var barbeiro = await _barbeiroService.PegarBarbeiroAsync(id);

            return Ok(barbeiro);
        }

        [HttpPost]
        public async Task<ActionResult<Barbeiro>> Post(CriarBarbeiroRequest request)
        {
            Barbeiro barbeiro = new Barbeiro
            {
                Nome = request.Nome,
                Email = request.Email,
                Experiencia = request.Experiencia,
                Contato = request.Contato,
                IdBarbearia = request.IdBarbearia
            };
            await _barbeiroService.CriarBarbeiroAsync(barbeiro);
            return Ok(barbeiro);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Barbeiro>> Put(int id, AtualizarBarbeiroRequest request)
        {
            Barbeiro barbeiro = new Barbeiro
            {
                Nome = request.Nome,
                Email = request.Email,
                Experiencia = request.Experiencia,
                Contato = request.Contato,
                IdBarbearia = request.IdBarbearia
            };
            await _barbeiroService.AtualizarBarbeiroAsync(id,barbeiro);
            return Ok(barbeiro);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _barbeiroService.DeletarBarbeiroAsync(id));
        }
    }
}
