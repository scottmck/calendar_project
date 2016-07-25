<?php 

declare(strict_types=1);

include_once '../sys/core/init.inc.php';

/*
 * If the user is not logged in, send them to the main file
 */
if(!isset($_SESSION['user']))
{
	header("Location: ./");
	exit;
}

$page_title = "Add/Edit Event";
$css_files = array("style.css", "admin.css");
include_once 'assets/common/header.inc.php';

/*
 *load the calendar 
 */
$cal = new Calendar($dbo);
?>

<div id="content">
<?php echo $cal->displayForm(); ?>
</div><!-- end #content -->

<?php
/*
 * Output the footer
 */ 
include_once 'assets/common/footer.inc.php';

?>