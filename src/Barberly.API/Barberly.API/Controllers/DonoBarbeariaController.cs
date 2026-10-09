using Barberly.API.Domain.DTOs.DonoBarbeariaDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonoBarbeariaController : ControllerBase
    {
        private readonly IDonoBarbeariaService _donobarbeariaService;

        public DonoBarbeariaController(IDonoBarbeariaService donobarbeariaService)
        {
            _donobarbeariaService = donobarbeariaService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DonoBarbearia>> Get(int id)
        {
            var donobarbearia = await _donobarbeariaService.PegarDonoBarbeariaAsync(id);

            return Ok(donobarbearia);
        }

        [HttpPost]
        public async Task<ActionResult<DonoBarbearia>> Post(CriarDonoBarbeariaRequest request)
        {
            DonoBarbearia donobarbearia = new DonoBarbearia
            {
                Nome = request.Nome,
                Senha = request.Senha,
                Email = request.Email,
                Contato = request.Contato
            };

            await _donobarbeariaService.CriarDonoBarbeariaAsync(donobarbearia);

            return Ok(donobarbearia);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DonoBarbearia>> Put(
            int id,
            AtualizarDonoBarbeariaRequest request)
        {
            DonoBarbearia donobarbearia = new DonoBarbearia
            {
                Nome = request.Nome,
                Senha = request.Senha,
                Email = request.Email,
                Contato = request.Contato
            };

            await _donobarbeariaService.AtualizarDonoBarbeariaAsync(
                id,
                donobarbearia);

            return Ok(donobarbearia);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            return Ok(
                await _donobarbeariaService.DeletarDonoBarbeariaAsync(id)
            );
        }
    }
}