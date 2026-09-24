using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonoBarbeariaController : ControllerBase
    {
        private readonly DataContext _context;
        public DonoBarbeariaController (DataContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public ActionResult<DonoBarbearia> Get(int id)
        {
            return new DonoBarbearia();
        }

        [HttpPost]
        public ActionResult<DonoBarbearia> Post(DonoBarbearia donobarbearia)
        {
            return new DonoBarbearia();
        }

        [HttpPut("{id}")]
        public ActionResult<DonoBarbearia> Put(int id, DonoBarbearia donobarbearia)
        {
            return new DonoBarbearia();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return NoContent();
        }
    }
}
