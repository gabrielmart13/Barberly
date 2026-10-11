
using Barberly.API.Domain.DTOs.BarbeariaDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BarbeariaController : ControllerBase
    {
        private readonly IBarbeariaService _barbeariaService;
        public BarbeariaController(IBarbeariaService barbeariaService)
        {
            _barbeariaService = barbeariaService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<List<Barbearia>>> Get()
        {
            var barbearias = await _barbeariaService.PegarBarbeariasAsync();
            return Ok(barbearias);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Barbearia>> Get(int id)
        {
            var barbearia = await _barbeariaService.PegarBarbeariaAsync(id);

            return Ok(barbearia);
        }

        [Authorize(Roles = "DonoBarbearia")]
        [HttpPost]
        public async Task<ActionResult<Barbearia>> Post(CriarBarbeariaRequest request)
        {
            var barbearia = await _barbeariaService.CriarBarbeariaAsync(request);
            return Ok(barbearia);
        }

        [Authorize(Roles = "DonoBarbearia")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Barbearia>> Put(int id, AtualizarBarbeariaRequest request)
        {
           var barbearia = await _barbeariaService.AtualizarBarbeariaAsync(id,request);
            return Ok(barbearia);
        }

        [Authorize(Roles = "DonoBarbearia")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(await _barbeariaService.DeletarBarbeariaAsync(id));
        }
    }
}
