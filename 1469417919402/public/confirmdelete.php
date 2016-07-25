<?php 

declare(strict_types=1);

/*
 * Enable sessions if needed
 * Avoid pesky warning if sesion already active
 */
$status = session_status();
if($status == PHP_SESSION_NONE){
	//there is no active session
	session_start();
}


/*
 * Make sure the event ID was passed and user is logged in
 */
if(isset($_POST['event_id']) && isset($_SESSION['user']))
{
	/*
	 * Collect the event ID from the URL string
	 */
	$id = (int) $_POST['event_id'];
}
else 
{
	/*
	 * Send the user to the main page if no id is supplied
	 * or user not logged in
	 */
	header("Location: ./");
	exit;
}

include_once '../sys/core/init.inc.php';

/*
 * Load the calendar
 */
$cal = new Calendar($dbo);
$markup = $cal->confirmDelete($id);

/*
 * Output the header
 */
$page_title = "View Event";
$css_files = array("style.css", "admin.css");
include_once 'assets/common/header.inc.php';

?>

<div id="content">
<?php echo $markup; ?>
</div><!-- end #content -->

<?php
/* 
 * Output the footer
 */
include_once 'assets/common/footer.inc.php';
?>